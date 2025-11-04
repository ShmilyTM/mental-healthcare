const Healer = require("../models/Healer");
const Appointment = require("../models/Appointment");

// [GET] Danh sách healer
exports.getHealers = async (req, res) => {
  try {
    const healers = await Healer.find().populate("user", "name email avatar");
    res.json(healers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Cập nhật lịch khả dụng
exports.updateSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const healer = await Healer.findOneAndUpdate(
      { user: req.user.id },
      { schedule },
      { new: true }
    );
    res.json({ message: "Cập nhật lịch thành công", healer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Cập nhật thu nhập (tự động sau mỗi buổi)
exports.updateEarnings = async (req, res) => {
  try {
    const { amount } = req.body;
    const healer = await Healer.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { earnings: amount } },
      { new: true }
    );
    res.json({ message: "Đã cập nhật thu nhập", healer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// [GET] Chi tiết healer theo ID
exports.getHealerById = async (req, res) => {
  try {
    const healer = await Healer.findById(req.params.id).populate(
      "user",
      "name email avatar phone"
    );
    if (!healer)
      return res.status(404).json({ message: "Không tìm thấy healer" });
    res.json(healer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải thông tin healer" });
  }
};

// [GET] /api/healers
exports.getHealers = async (req, res) => {
  try {
    const healers = await Healer.find();
    res.json(healers);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải danh sách healer" });
  }
};

// [GET] /api/healers/:id
exports.getHealerById = async (req, res) => {
  try {
    const healer = await Healer.findById(req.params.id);
    if (!healer) return res.status(404).json({ message: "Không tìm thấy healer" });
    res.json(healer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải thông tin healer" });
  }
};

// [PUT] /api/healers/schedule
exports.updateSchedule = async (req, res) => {
  try {
    const healer = await Healer.findById(req.user.id);
    healer.schedule = req.body.schedule;
    await healer.save();
    res.json(healer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật lịch làm việc" });
  }
};

// [PUT] /api/healers/earnings
exports.updateEarnings = async (req, res) => {
  try {
    const healer = await Healer.findById(req.user.id);
    healer.earnings = req.body.earnings;
    await healer.save();
    res.json(healer);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật thu nhập" });
  }
};
