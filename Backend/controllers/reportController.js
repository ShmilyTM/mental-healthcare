const Report = require("../models/Report");

// [POST] Người dùng gửi báo cáo
exports.createReport = async (req, res) => {
  try {
    const { category, message } = req.body;
    const report = new Report({ reporter: req.user.id, category, message });
    await report.save();
    res.status(201).json({ message: "Đã gửi báo cáo thành công", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Admin xem tất cả báo cáo
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email role")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Admin cập nhật trạng thái xử lý
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNote },
      { new: true }
    );
    res.json({ message: "Đã cập nhật báo cáo", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
