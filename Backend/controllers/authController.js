const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { generateOTP } = require("../utils/generateOTP");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// 🧩 Hàm tạo JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🧾 Đăng ký (Sign Up)
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email đã tồn tại" });

    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: "Đăng ký thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔑 Đăng nhập (Sign In) — có tài khoản admin cứng
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👑 ADMIN CỨNG (bỏ qua database)
    if (email === "admin@mentalcare.com" && password === "admin123") {
      const adminUser = {
        _id: "000000000000000000000001",
        name: "Super Admin",
        email: "admin@mentalcare.com",
        role: "admin",
        phone: "0987654321",
        avatar: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
      };

      const token = generateToken(adminUser);

      return res.json({
        message: "Đăng nhập Admin thành công",
        token,
        user: adminUser,
      });
    }

    // 👤 Người dùng thường
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    if (user.suspended)
      return res
        .status(403)
        .json({ message: "Tài khoản đã bị khóa. Liên hệ quản trị viên." });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Sai mật khẩu" });

    const token = generateToken(user);

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚪 Đăng xuất (Sign Out)
exports.signout = (req, res) => {
  res.json({ message: "Đăng xuất thành công" });
};

// 🔄 Quên mật khẩu (Gửi OTP)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy email" });

    const otp = generateOTP();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail(
      user.email,
      "🔐 OTP khôi phục mật khẩu",
      `Xin chào ${user.name},\n\nMã OTP của bạn là: ${otp}\nMã có hiệu lực trong 10 phút.\n\nTrân trọng,\nMental HealthCare`
    );

    res.json({ message: "OTP đã được gửi đến email của bạn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Đặt lại mật khẩu (Nhập OTP)
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });

    user.password = newPassword; // tự động hash trong pre('save')
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧍 Cập nhật hồ sơ (kèm avatar upload)
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, bio, specialization, experience } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy tài khoản" });

    // Upload avatar nếu có file
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "mental_healthcare/avatars",
        transformation: [{ width: 400, height: 400, crop: "fill" }],
      });
      user.avatar = result.secure_url;
      fs.unlinkSync(req.file.path); // Xóa file tạm
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.bio = bio || user.bio;
    user.specialization = specialization || user.specialization;
    user.experience = experience || user.experience;

    await user.save();

    res.json({
      message: "Cập nhật hồ sơ thành công",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// 👑 Admin xem danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
