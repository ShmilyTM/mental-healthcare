const Appointment = require("../models/Appointment");

// [POST] Tạo lịch hẹn
exports.createAppointment = async (req, res) => {
  try {
    const { targetId, type, date, time, mode, note } = req.body;

    const appointment = new Appointment({
      customer: req.user.id,
      expert: targetId,
      expertType: type === "doctor" ? "Doctor" : "Healer",
      date,
      time,
      mode,
      note,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Đã tạo lịch hẹn thành công", appointment });
  } catch (err) {
    console.error("❌ Appointment error:", err);
    res.status(500).json({ message: "Lỗi khi tạo lịch hẹn" });
  }
};

// [GET] Lấy lịch hẹn của người dùng
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ customer: req.user.id })
      .populate("expert", "name specialization")
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [DELETE] Hủy lịch hẹn (khách hàng)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      customer: req.user.id,
    });
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    await Appointment.deleteOne({ _id: appointment._id });
    res.json({ message: "Đã hủy lịch hẹn" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] 👑 Admin xem tất cả lịch hẹn
exports.getAllAppointments = async (req, res) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const appointments = await Appointment.find(filter)
      .populate("customer", "name email")
      .populate("expert", "name specialization")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách lịch hẹn:", err);
    res.status(500).json({ message: "Lỗi lấy danh sách lịch hẹn" });
  }
};

// [PATCH] 👑 Admin duyệt / từ chối lịch hẹn
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });

    appointment.status = status;
    await appointment.save();

    res.json({
      message: `Đã cập nhật trạng thái thành ${status}`,
      appointment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] 👨‍⚕️ Bác sĩ xem lịch hẹn của mình
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const appointments = await Appointment.find({
      expert: doctorId,
      expertType: "Doctor",
    })
      .populate("customer", "name email")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch hẹn bác sĩ:", err);
    res.status(500).json({ message: "Lỗi lấy lịch hẹn bác sĩ" });
  }
};

// [PATCH] 👨‍⚕️ Bác sĩ hủy lịch hẹn
exports.cancelByDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.expert.toString() !== doctorId)
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });

    if (appointment.status === "cancelled")
      return res
        .status(400)
        .json({ message: "Appointment already cancelled" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully by doctor",
      appointment,
    });
  } catch (err) {
    console.error("❌ Cancel appointment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🧘‍♀️ [GET] Healer xem lịch hẹn của mình
exports.getHealerAppointments = async (req, res) => {
  try {
    const healerId = req.user.id;

    const appointments = await Appointment.find({
      expert: healerId,
      expertType: "Healer",
    })
      .populate("customer", "name email")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch hẹn healer:", err);
    res.status(500).json({ message: "Lỗi lấy lịch hẹn healer" });
  }
};

// 🧘‍♀️ [PATCH] Healer xác nhận lịch hẹn
exports.confirmByHealer = async (req, res) => {
  try {
    const { id } = req.params;
    const healerId = req.user.id;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.expert.toString() !== healerId)
      return res
        .status(403)
        .json({ message: "Not authorized to confirm this appointment" });

    appointment.status = "confirmed";
    await appointment.save();

    res.json({
      message: "Appointment confirmed successfully by healer",
      appointment,
    });
  } catch (err) {
    console.error("❌ Confirm appointment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 🧘‍♀️ [PATCH] Healer hủy lịch hẹn
exports.cancelByHealer = async (req, res) => {
  try {
    const { id } = req.params;
    const healerId = req.user.id;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.expert.toString() !== healerId)
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this appointment" });

    if (appointment.status === "cancelled")
      return res
        .status(400)
        .json({ message: "Appointment already cancelled" });

    appointment.status = "cancelled";
    await appointment.save();

    res.json({
      message: "Appointment cancelled successfully by healer",
      appointment,
    });
  } catch (err) {
    console.error("❌ Cancel appointment error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
