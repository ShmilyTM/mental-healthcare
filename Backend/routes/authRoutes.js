const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  updateProfile,
  getAllUsers, // ✅ thêm dòng này
} = require("../controllers/authController");

// 🧾 Đăng ký
router.post("/signup", signup);

// 🔑 Đăng nhập (có sẵn admin cứng)
router.post("/signin", signin);

// 🚪 Đăng xuất
router.post("/signout", signout);

// 🔄 Quên mật khẩu (Gửi OTP)
router.post("/forgot-password", forgotPassword);

// 🔐 Nhập OTP để đặt lại mật khẩu
router.post("/reset-password", resetPassword);

// 🧍 Cập nhật hồ sơ người dùng (có hỗ trợ upload avatar)
router.put("/update-profile", protect, upload.single("avatar"), updateProfile);

// 👑 Lấy danh sách người dùng (chỉ admin)
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
