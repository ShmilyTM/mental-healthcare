const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

// [GET] Danh sách bác sĩ
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", "name email avatar");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Cập nhật lịch khả dụng
exports.updateSchedule = async (req, res) => {
  try {
    const { schedule } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { schedule },
      { new: true }
    );
    res.json({ message: "Cập nhật lịch thành công", doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Lịch hẹn của bác sĩ
exports.viewAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    const appointments = await Appointment.find({ expert: doctor._id })
      .populate("customer", "name email phone")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Chấp nhận / từ chối lịch hẹn
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body; // confirmed / rejected
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: "Đã cập nhật trạng thái", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Ghi chú sau buổi trị liệu
exports.addConsultationNote = async (req, res) => {
  try {
    const { note } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { notes: note },
      { new: true }
    );
    res.json({ message: "Đã lưu ghi chú tư vấn", appointment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// [GET] Chi tiết bác sĩ theo ID
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      "user",
      "name email avatar phone"
    );
    if (!doctor)
      return res.status(404).json({ message: "Không tìm thấy chuyên gia" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải thông tin chuyên gia" });
  }
};

// [GET] /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tải danh sách bác sĩ" });
  }
};

// [GET] /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Không tìm thấy chuyên gia" });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải thông tin bác sĩ" });
  }
};

// [PUT] /api/doctors/schedule
exports.updateSchedule = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id);
    doctor.schedule = req.body.schedule;
    await doctor.save();
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật lịch làm việc" });
  }
};

// Các hàm khác (viewAppointments, updateAppointmentStatus, addConsultationNote) bạn có thể giữ nguyên

