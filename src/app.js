const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/environment");
const swaggerSpec = require("./utils/swagger");
const logger = require("./utils/logger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images to be loaded
  }),
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://yayasansemestalestari.com',
      'https://www.yayasansemestalestari.com',
      'https://backend.yayasansemestalestari.com',
      'http://localhost:3000', // Frontend Admin
      'http://localhost:3001', // Frontend Public
      'http://localhost:5173'  // Vite default port
    ];

    // Izinkan request tanpa origin atau yang ada di dalam daftar
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  // Menghapus 'allowedHeaders' agar server otomatis menerima/memantulkan 
  // SEMUA header tambahan yang dikirim frontend (mencegah blokir karena header yang tidak dikenal)
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files from uploads directory (no caching)
app.use(
  "/uploads",
  // Path sekarang mengarah ke LUAR direktori project
  express.static(path.join(__dirname, "../../uploads"), {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, private",
        Pragma: "no-cache",
        Expires: "0",
      });
    },
  }),
);

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Disable caching - prevent 304 responses
app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
});

// Rate limiting - DISABLED
// app.use('/api', apiLimiter);

// Swagger documentation
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

  // Swagger JSON endpoint
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(
    `Swagger documentation available at http://localhost:${config.port}/api-docs`,
  );
}

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

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

module.exports = app;
