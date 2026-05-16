const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const {
  userSchemas,
  articleSchemas,
  categorySchemas,
  contentSchemas,
} = require("../utils/validation");
const { authLimiter } = require("../middleware/rateLimiter");
const { uploadSingle, uploadMultiple } = require("../middleware/upload");

// Controllers
const authController = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");
const articleController = require("../controllers/articleController");
const awardController = require("../controllers/awardController");
const merchandiseController = require("../controllers/merchandiseController");
const galleryController = require("../controllers/galleryController");
const galleryCategoryController = require("../controllers/galleryCategoryController");
const contactController = require("../controllers/contactController");
const pageController = require("../controllers/pageController");
const settingsController = require("../controllers/settingsController");
const programController = require("../controllers/programController");
const partnerController = require("../controllers/partnerController");
const faqController = require("../controllers/faqController");
const categoryController = require("../controllers/categoryController");
const programCategoryController = require("../controllers/programCategoryController");
const adminStatisticsController = require("../controllers/statisticsController");
const uploadController = require("../controllers/uploadController");
const { seedData } = require("../scripts/seedDatabase");
const {
  heroController,
  visionController,
  missionController,
  impactController,
  impactSectionController,
  donationCtaController,
  closingCtaController,
  historyController,
  historySectionController,
  leadershipController,
  leadershipSectionController,
  statisticsController,
  programsSectionController,
  partnersSectionController,
  faqSectionController,
  contactSectionController,
} = require("../controllers/adminHomeController");

// Authentication routes (no auth required for login)
// Rate limiter disabled for login
router.post("/auth/login", validate(userSchemas.login), authController.login);

// Temporary public endpoint to run database seeders when data is still empty
let seedInProgress = false;
const runSeedEndpoint = async (req, res, next) => {
  try {
    if (seedInProgress) {
      return res.status(409).json({
        success: false,
        message: "Seeder is already running",
      });
    }

    seedInProgress = true;

    setImmediate(() => {
      seedData()
        .then(() => {
          seedInProgress = false;
        })
        .catch((error) => {
          seedInProgress = false;
          console.error("Seeder failed:", error);
        });
    });

    return res.status(202).json({
      success: true,
      message: "Seeder started",
    });
  } catch (error) {
    next(error);
  }
};

router.get("/seed", runSeedEndpoint);
router.post("/seed", runSeedEndpoint);

// Protected routes (require authentication)
router.use(authenticate);

router.post("/auth/logout", authController.logout);
router.post("/auth/refresh-token", authController.refreshToken);
router.get("/auth/me", authController.getCurrentUser);

// Dashboard
router.get("/dashboard", dashboardController.getDashboardStats);
router.get("/dashboard/stats", dashboardController.getDetailedStats);

// Statistics
router.get("/statistics", adminStatisticsController.getAdminStatistics);

// Homepage Management
router.get("/homepage/hero", heroController.get);
router.put("/homepage/hero", heroController.update);

router.get("/homepage/vision", visionController.get);
router.put("/homepage/vision", visionController.update);

router.get("/homepage/missions", missionController.getAllAdmin);
router.post("/homepage/missions", missionController.create);
router.put("/homepage/missions/:id", missionController.update);
router.delete("/homepage/missions/:id", missionController.delete);

router.get("/homepage/impact", impactController.getAllAdmin);
router.get("/homepage/impact/:id", impactController.getByIdAdmin);
router.post("/homepage/impact", impactController.create);
router.put("/homepage/impact/:id", impactController.update);
router.delete("/homepage/impact/:id", impactController.delete);

router.get("/homepage/impact-section", impactSectionController.get);
router.put("/homepage/impact-section", impactSectionController.update);

router.get("/homepage/donation-cta", donationCtaController.get);
router.put("/homepage/donation-cta/:id", donationCtaController.update);

router.get("/homepage/closing-cta", closingCtaController.get);
router.put("/homepage/closing-cta/:id", closingCtaController.update);

router.get("/homepage/statistics", statisticsController.get);
router.put("/homepage/statistics", statisticsController.update);

router.get("/homepage/programs-section", programsSectionController.get);
router.put("/homepage/programs-section", programsSectionController.update);

router.get("/homepage/partners-section", partnersSectionController.get);
router.put("/homepage/partners-section", partnersSectionController.update);

router.get("/homepage/faq-section", faqSectionController.get);
router.put("/homepage/faq-section", faqSectionController.update);

router.get("/homepage/contact-section", contactSectionController.get);
router.put("/homepage/contact-section", contactSectionController.update);

// About Page Management
router.get("/about/history", historyController.getAllAdmin);
router.get("/about/history/:id", historyController.getByIdAdmin);
router.post("/about/history", historyController.create);
router.put("/about/history/:id", historyController.update);
router.delete("/about/history/:id", historyController.delete);

router.get("/about/history-section", historySectionController.get);
router.put("/about/history-section", historySectionController.update);

router.get("/about/missions", missionController.getAllAdmin);
router.post("/about/missions", missionController.create);
router.put("/about/missions/:id", missionController.update);
router.delete("/about/missions/:id", missionController.delete);

router.get("/about/leadership", leadershipController.getAllAdmin);
router.get("/about/leadership/:id", leadershipController.getByIdAdmin);
router.post("/about/leadership", leadershipController.create);
router.put("/about/leadership/:id", leadershipController.update);
router.delete("/about/leadership/:id", leadershipController.delete);

router.get("/about/leadership-section", leadershipSectionController.get);
router.put("/about/leadership-section", leadershipSectionController.update);

// Page Settings
const pageRoutes = [
  "articles",
  "awards",
  "merchandise",
  "gallery",
  "leadership",
  "contact",
  "history",
  "vision-mission",
  "about",
  "programs",
];
pageRoutes.forEach((page) => {
  router.get(`/pages/${page}`, (req, res, next) => {
    req.params.slug = page;
    pageController.getPageSettings(req, res, next);
  });
  router.put(`/pages/${page}`, (req, res, next) => {
    req.params.slug = page;
    pageController.updatePageSettings(req, res, next);
  });
});

// Article Management
router.get("/articles", articleController.getAllArticlesAdmin);
router.post(
  "/articles",
  validate(articleSchemas.create),
  articleController.createArticle,
);
router.get("/articles/:id", articleController.getArticleById);
router.put(
  "/articles/:id",
  validate(articleSchemas.update),
  articleController.updateArticle,
);
router.delete("/articles/:id", articleController.deleteArticle);

// Gallery Management
router.get("/gallery", galleryController.getAllAdmin);
router.post("/gallery", galleryController.create);
router.get("/gallery/:id", galleryController.getByIdAdmin);
router.put("/gallery/:id", galleryController.update);
router.delete("/gallery/:id", galleryController.delete);

// Gallery Category Management
router.get("/gallery-categories", galleryCategoryController.getAllAdmin);
router.post("/gallery-categories", galleryCategoryController.create);
router.get("/gallery-categories/:id", galleryCategoryController.getByIdAdmin);
router.put("/gallery-categories/:id", galleryCategoryController.update);
router.delete("/gallery-categories/:id", galleryCategoryController.delete);

// Merchandise Management
router.get("/merchandise", merchandiseController.getAllAdmin);
router.post("/merchandise", merchandiseController.create);
router.get("/merchandise/:id", merchandiseController.getByIdAdmin);
router.put("/merchandise/:id", merchandiseController.update);
router.delete("/merchandise/:id", merchandiseController.delete);

// Award Management
router.get("/awards", awardController.getAllAdmin);
router.post("/awards", awardController.create);
router.get("/awards/:id", awardController.getByIdAdmin);
router.put("/awards/:id", awardController.update);
router.delete("/awards/:id", awardController.delete);

// Program Management
router.get("/programs", programController.getAllAdmin);
router.post("/programs", programController.create);
router.get("/programs/:id", programController.getByIdAdmin);
router.put("/programs/:id", programController.update);
router.delete("/programs/:id", programController.delete);

// Partner Management
router.get("/partners", partnerController.getAllAdmin);
router.post("/partners", partnerController.create);
router.get("/partners/:id", partnerController.getByIdAdmin);
router.put("/partners/:id", partnerController.update);
router.delete("/partners/:id", partnerController.delete);

// FAQ Management
router.get("/faqs", faqController.getAllAdmin);
router.post("/faqs", faqController.create);
router.get("/faqs/:id", faqController.getByIdAdmin);
router.put("/faqs/:id", faqController.update);
router.delete("/faqs/:id", faqController.delete);

// Category Management
router.get("/categories", categoryController.getAllAdmin);
router.post(
  "/categories",
  validate(categorySchemas.create),
  categoryController.create,
);
router.get("/categories/:id", categoryController.getByIdAdmin);
router.put(
  "/categories/:id",
  validate(categorySchemas.update),
  categoryController.update,
);
router.delete("/categories/:id", categoryController.delete);

// Program Category Management
router.get("/program-categories", programCategoryController.getAllAdmin);
router.post("/program-categories", programCategoryController.create);
router.get("/program-categories/:id", programCategoryController.getByIdAdmin);
router.put("/program-categories/:id", programCategoryController.update);
router.delete("/program-categories/:id", programCategoryController.delete);

// Contact Messages Management
router.get("/contact/show-messages", contactController.getAllMessages);
router.post("/contact/show-messages", contactController.createMessage);
router.get("/contact/show-messages/:id", contactController.getMessageById);
router.put("/contact/show-messages/:id", contactController.updateMessage);
router.put("/contact/show-messages/:id/read", contactController.markAsRead);
router.delete("/contact/show-messages/:id", contactController.deleteMessage);

// Contact Info Management
router.get("/contact/info", contactController.getContactInfoAdmin);
router.put("/contact/info", contactController.updateContactInfo);

// Footer Management
const footerController = require("../controllers/footerController");
router.get("/footer", footerController.getFooterAdmin);
router.put("/footer", footerController.updateFooterAdmin);

// Settings Management
router.get("/config", settingsController.getAllSettings);
router.get("/config/:key", settingsController.getSettingByKey);
router.put("/config/:key", settingsController.updateSetting);

// SEO Settings (alias for page settings)
router.get("/seo", settingsController.getAllSettings);
router.put("/seo", settingsController.updateSetting);

// User Management
router.get("/users", settingsController.getAllUsers);
router.post(
  "/users",
  validate(userSchemas.register),
  settingsController.createUser,
);
router.get("/users/:id", settingsController.getUserById);
router.put(
  "/users/:id",
  validate(userSchemas.update),
  settingsController.updateUser,
);
router.delete("/users/:id", settingsController.deleteUser);

// Image Upload Management
router.post(
  "/upload/:entity",
  uploadSingle("image"),
  uploadController.uploadImage,
);
router.post(
  "/upload/multiple/:entity",
  uploadMultiple("images", 10),
  uploadController.uploadMultipleImages,
);
router.post(
  "/upload/replace/:entity",
  uploadSingle("image"),
  uploadController.replaceImage,
);
router.delete("/upload", uploadController.deleteImage);

module.exports = router;
