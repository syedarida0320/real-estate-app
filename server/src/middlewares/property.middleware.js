const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {response}=require("../utils/response");

// ✅ Upload directory
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();

// ✅ Allowed extensions and mime types
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// ✅ File filter for extension & mime type check
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype.toLowerCase();

  if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
    return cb(
      new Error(
        "Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are allowed."
      ),
      false
    );
  }

  cb(null, true);
};

// ✅ Multer instance
// TODO: Image size check and Exention check also with mimeType
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 },
});

// For property creation/updating
const propertyUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// For single image upload routes
const singleUpload = upload.single("image");
const galleryUpload = upload.array("images", 10);

// ✅ Centralized error handling middleware for Multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors (file too large, wrong field, etc.)
    return response.badRequest(res, err.message);
  } else if (err) {
    // Custom validation errors (invalid extension, mime type)
    return response.validationError(res, err.message);
  }
  next();
};

module.exports = { propertyUpload, singleUpload, galleryUpload, handleMulterError };
