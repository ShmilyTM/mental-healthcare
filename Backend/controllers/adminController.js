const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Payment = require("../models/Payment");
const EmotionStat = require("../models/EmotionStat");
const SystemSetting = require("../models/SystemSetting");

// 📊 Thống kê tổng thể hệ thống
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalHealers = await User.countDocuments({ role: "healer" });
    const totalAppointments = await Appointment.countDocuments();
    const totalPayments = await Payment.countDocuments({ status: "success" });
    const totalRevenueAgg = await Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // Lấy cảm xúc phổ biến nhất
    const stats = await EmotionStat.aggregate([
      { $unwind: "$emotionCounts" },
      {
        $group: {
          _id: "$emotion",
          total: { $sum: "$emotionCounts" },
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({
      totalUsers,
      totalDoctors,
      totalHealers,
      totalAppointments,
      totalPayments,
      totalRevenue,
      topEmotions: stats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🚫 Khóa tài khoản
exports.suspendAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { suspended: true }, { new: true });
    res.json({ message: "Tài khoản đã bị khóa", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Mở lại tài khoản
exports.reactivateAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { suspended: false }, { new: true });
    res.json({ message: "Tài khoản đã được mở lại", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⚙️ Xem cài đặt hệ thống
exports.getSystemSettings = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne();
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Cập nhật cài đặt hệ thống
exports.updateSystemSettings = async (req, res) => {
  try {
    const data = req.body;
    const updated = await SystemSetting.findOneAndUpdate({}, data, {
      upsert: true,
      new: true,
    });
    res.json({ message: "Đã cập nhật cài đặt hệ thống", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
