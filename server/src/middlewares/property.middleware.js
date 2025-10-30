const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Upload directory
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// ✅ Multer instance
const upload = multer({ storage });

// For property creation/updating
const propertyUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

// For single image upload routes
const singleUpload = upload.single("image");
const galleryUpload = upload.array("images", 10);

module.exports = { propertyUpload, singleUpload, galleryUpload };
