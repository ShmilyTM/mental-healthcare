const Doctor = require("../models/Doctor");
const Healer = require("../models/Healer");

// 🩺 CREATE DOCTOR
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, description } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const doctor = new Doctor({ name, specialization, description, avatar });
    await doctor.save();
    res.status(201).json({ message: "Đã thêm bác sĩ mới", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {
  try {
    const { name, specialization, description } = req.body;
    const updateData = { name, specialization, description };
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!doctor) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
    res.json({ message: "Cập nhật bác sĩ thành công", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE DOCTOR
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa bác sĩ" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 GET ALL DOCTORS
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧘 CREATE HEALER
exports.createHealer = async (req, res) => {
  try {
    const { name, specialization, description, pricePerHour } = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    if (pricePerHour < 25000 || pricePerHour > 30000) {
      return res.status(400).json({ message: "Giá healer phải nằm trong khoảng 25k - 30k/giờ" });
    }

    const healer = new Healer({ name, specialization, description, avatar, pricePerHour });
    await healer.save();
    res.status(201).json({ message: "Đã thêm healer mới", healer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 UPDATE HEALER
exports.updateHealer = async (req, res) => {
  try {
    const { name, specialization, description, pricePerHour } = req.body;
    const updateData = { name, specialization, description, pricePerHour };
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    const healer = await Healer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!healer) return res.status(404).json({ message: "Không tìm thấy healer" });
    res.json({ message: "Cập nhật healer thành công", healer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ DELETE HEALER
exports.deleteHealer = async (req, res) => {
  try {
    await Healer.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa healer" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 GET ALL HEALERS
exports.getAllHealers = async (req, res) => {
  try {
    const healers = await Healer.find().sort({ createdAt: -1 });
    res.json(healers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
