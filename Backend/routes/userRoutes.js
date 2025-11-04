const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAllUsers,
  updateRole,
  toggleSuspend,
  deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// 👑 Admin - Lấy danh sách tất cả người dùng
router.get("/", protect, adminOnly, getAllUsers);

// 🧘 Người dùng - Lấy thông tin cá nhân
router.get("/profile", protect, getProfile);

// 🧘 Cập nhật hồ sơ
router.put("/profile", protect, upload.single("avatar"), updateProfile);

// 👑 Admin - Cập nhật vai trò
router.put("/:id/role", protect, adminOnly, updateRole);

// 👑 Admin - Khóa / Mở tài khoản
router.put("/:id/suspend", protect, adminOnly, toggleSuspend);

// 👑 Admin - Xóa người dùng
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
