const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ======================================================
// 👑 ADMIN - LẤY DANH SÁCH TOÀN BỘ NGƯỜI DÙNG
// ======================================================
// 👑 Admin - Lấy danh sách người dùng (có tìm kiếm + phân trang)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    const query = {
      $and: [
        role ? { role } : {},
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };

    const skip = (page - 1) * limit;
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      users,
      total: totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};



// ======================================================
// 🧩 [GET] /api/users/profile
// 👉 Lấy thông tin hồ sơ người dùng hiện tại
// ======================================================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

// ======================================================
// 🧩 [PUT] /api/users/profile
// 👉 Cập nhật hồ sơ người dùng
// ======================================================
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Cập nhật các trường cơ bản
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // Nếu có file ảnh upload (qua Multer)
    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật hồ sơ:", err);
    res.status(500).json({ message: "Lỗi cập nhật hồ sơ" });
  }
};

// ======================================================
// 👑 [PUT] /api/users/:id/role
// 👉 Cập nhật vai trò người dùng (Admin Only)
// ======================================================
exports.updateRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.role = req.body.role;
    await user.save();
    res.json({ message: "Cập nhật vai trò thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật vai trò:", err);
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 👑 [PUT] /api/users/:id/suspend
// 👉 Khóa / Mở khóa tài khoản người dùng
// ======================================================
exports.toggleSuspend = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.suspended = req.body.suspended;
    await user.save();
    res.json({ message: "Cập nhật trạng thái tài khoản thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi khóa/mở tài khoản:", err);
    res.status(500).json({ message: err.message });
  }
};

// ======================================================
// 👑 [DELETE] /api/users/:id
// 👉 Xóa tài khoản người dùng
// ======================================================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa người dùng:", err);
    res.status(500).json({ message: err.message });
  }
};
