const multer = require("multer");
const path = require("path");
const logger = require("../utils/logger");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./dev-data/img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // check if the file type is allowed
  const allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.error("Invalid file type", { mimeType: file.mimetype });
    cb(new Error("Invalid file Type"));
  }
};

const uploadImage = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB
  },
  fileFilter: fileFilter,
});

module.exports = uploadImage;
