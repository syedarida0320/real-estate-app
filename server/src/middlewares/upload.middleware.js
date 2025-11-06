const multer = require("multer");
const path = require("path");
const {response}=require("../utils/response")


const storage = multer.memoryStorage(); // store file temporarily in memory

// ✅ Allowed file types
const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

// ✅ File filter for type validation
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, 
});

// ✅ Centralized Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // e.g., file too large
    let message = err.code === "LIMIT_FILE_SIZE"
      ? "Image too large. Maximum allowed size is 5MB."
      : err.message;
    return response.badRequest(res, message);
  } else if (err) {
    // invalid type or extension
    return response.validationError(res, err.message);
  }

  next();
};

module.exports = { upload, handleMulterError };
