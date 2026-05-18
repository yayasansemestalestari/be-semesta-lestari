const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/environment");
const swaggerSpec = require("./utils/swagger");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();

// Behind LiteSpeed / Nginx / Hostinger reverse proxy: trust 1 hop so
// req.ip, secure cookies, and rate-limiters see the real client.
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS — allowed list plus regex for any subdomain of the main domain.
// Falls back to allowing the request (returns true) on any unknown origin
// so a misconfigured FE never causes the browser to mask a 5xx as "CORS error".
const ALLOWED_ORIGINS = [
  "https://yayasansemestalestari.com",
  "https://www.yayasansemestalestari.com",
  "https://backend.yayasansemestalestari.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];
const ALLOWED_REGEX = /^https?:\/\/([a-z0-9-]+\.)*yayasansemestalestari\.com$/i;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin) || ALLOWED_REGEX.test(origin)) {
      return callback(null, true);
    }
    logger.warn(`CORS: origin not in allow-list: ${origin}`);
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static uploads.
// Resolve to an absolute path once at boot and log it so we can spot
// misconfig on Hostinger immediately instead of getting silent 404/503.
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  logger.info(`Serving /uploads from ${UPLOADS_DIR}`);
} catch (e) {
  logger.error(`Cannot ensure uploads dir at ${UPLOADS_DIR}: ${e.message}`);
}

app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        Expires: "0",
      });
    },
  }),
);

// Request logging — skip noisy paths to keep shared-host disk/console quiet.
app.use((req, res, next) => {
  if (req.path !== "/api/health" && !req.path.startsWith("/uploads")) {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  }
  next();
});

// Disable caching for API responses
app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

// Swagger
if (config.swagger.enabled) {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Semesta Lestari API Documentation",
    }),
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(
    `Swagger documentation available at http://localhost:${config.port}/api-docs`,
  );
}

// Lightweight liveness endpoint (no DB hit) — point UptimeRobot here so the
// app process is kept warm without thrashing the MySQL pool.
app.get("/ping", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.status(200).type("text/plain").send("pong");
});

// API routes
const routes = require("./routes");
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Semesta Lestari API",
    version: "1.0.0",
    documentation: config.swagger.enabled ? `/api-docs` : "Disabled",
    endpoints: {
      health: "/api/health",
      public: "/api/*",
      admin: "/api/admin/*",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
