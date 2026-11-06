import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Resilient upload directory: attempts ./temp, falls back to os.tmpdir() if container filesystem is restricted
let uploadDir = path.resolve("./temp");

try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  fs.accessSync(uploadDir, fs.constants.W_OK);
} catch (e) {
  uploadDir = path.join(os.tmpdir(), "zen-temp");
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  } catch (err) {
    uploadDir = os.tmpdir();
  }
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype.startsWith("image/") ||
    file.mimetype === "text/plain" ||
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Supported formats: PDF, Images, TXT, CSV, DOCX."));
  }
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
});
