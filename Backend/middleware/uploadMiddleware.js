const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🧩 Tự động tạo thư mục uploads nếu chưa có
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🧠 Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// 🧱 Lọc loại file hợp lệ
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Chỉ chấp nhận file ảnh (jpg, jpeg, png)"));
  }
};

// 🚀 Xuất cấu hình multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 3 * 1024 * 1024, // Giới hạn 3MB
  },
});

module.exports = upload;
