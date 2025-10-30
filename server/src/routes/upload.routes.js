const express= require("express");
const multer=require("multer");
const path=require ("path");
const fs=require ("fs");
const {singleUpload, galleryUpload}=require("../middlewares/property.middleware")

const router = express.Router();

// ✅ Create upload folder if not exists
const uploadDir = path.join(__dirname, "../uploads"); // inside src
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});


const upload = multer({ storage });

// 📤 Upload main image
router.post("/main-image", singleUpload , (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "No file uploaded." });
  res.json({ filePath: req.file.path });
});

// 📤 Upload multiple gallery images
router.post("/gallery", galleryUpload , (req, res) => {
  if (!req.files)
    return res.status(400).json({ message: "No files uploaded." });
  const filePaths = req.files.map((file) => file.path);
  res.json({ filePaths });
});

module.exports=router;
