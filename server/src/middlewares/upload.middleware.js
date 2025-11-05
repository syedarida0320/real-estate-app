const multer = require("multer");

const storage = multer.memoryStorage(); // store file temporarily in memory

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files (jpg/png/webp) are allowed"), false);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
