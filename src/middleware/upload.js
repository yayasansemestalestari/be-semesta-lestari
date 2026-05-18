const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create subdirectories for different entity types
const entityDirs = [
  'articles',
  'awards',
  'gallery',
  'merchandise',
  'programs',
  'partners',
  'leadership',
  'history',
  'pages',
  'hero',
  'donation',
  'closing',
  'impact_section',
  'vision',
  'donation_cta'
];

entityDirs.forEach(dir => {
  const dirPath = path.join(uploadsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      // Get entity type from route or body
      const entityType = req.params.entity || req.body.entity || 'general';
      const uploadPath = path.join(uploadsDir, entityType);
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
    } catch (error) {
      console.error("Multer Destination Error:", error);
      cb(error);
    }
  },
  filename: function (req, file, cb) {
    try {
      // Generate unique filename: timestamp-randomstring-originalname
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const nameWithoutExt = path.basename(file.originalname, ext);
      const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      cb(null, sanitizedName + '-' + uniqueSuffix + ext);
    } catch (error) {
      console.error("Multer Filename Error:", error);
      cb(error);
    }
  }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

// Middleware for single file upload
const uploadSingle = (fieldName = 'image') => {
  return upload.single(fieldName);
};

// Middleware for multiple files upload
const uploadMultiple = (fieldName = 'images', maxCount = 10) => {
  return upload.array(fieldName, maxCount);
};

// Helper function to delete file
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Helper function to get file path from URL
const getFilePathFromUrl = (url) => {
  if (!url) return null;
  
  // Extract path from URL (e.g., /uploads/articles/image.jpg)
  const urlPath = url.replace(/^https?:\/\/[^\/]+/, '');
  return path.join(__dirname, '../..', urlPath);
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  deleteFile,
  getFilePathFromUrl
};
