const Meditation = require("../models/Meditation");

// 🌿 [GET] /api/meditations
// 👉 Lấy danh sách tất cả bài thiền (Public)
exports.getAllMeditations = async (req, res) => {
  try {
    const meditations = await Meditation.find().sort({ createdAt: -1 });
    res.status(200).json(meditations);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách bài thiền:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bài thiền" });
  }
};

// 🌿 [GET] /api/meditations/:id
// 👉 Lấy chi tiết 1 bài thiền theo ID (Public)
exports.getMeditationById = async (req, res) => {
  try {
    const meditation = await Meditation.findById(req.params.id);
    if (!meditation)
      return res.status(404).json({ message: "Không tìm thấy bài thiền" });
    res.status(200).json(meditation);
  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết bài thiền:", err);
    res.status(500).json({ message: "Lỗi khi lấy chi tiết bài thiền" });
  }
};

// 🌿 [POST] /api/meditations
// 👉 Tạo mới 1 bài thiền (Admin only)
exports.createMeditation = async (req, res) => {
  try {
    const { title, description, category, duration, image, url } = req.body;

    if (!title || !url) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ tiêu đề và đường dẫn file" });
    }

    const newMeditation = new Meditation({
      title,
      description,
      category,
      duration,
      image,
      url,
      createdBy: req.user ? req.user._id : null,
    });

    const savedMeditation = await newMeditation.save();
    res.status(201).json({
      message: "Đã tạo bài thiền mới thành công",
      meditation: savedMeditation,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo bài thiền:", err);
    res.status(500).json({ message: "Lỗi khi tạo bài thiền" });
  }
};

// 🌿 [PUT] /api/meditations/:id
// 👉 Cập nhật bài thiền (Admin only)
exports.updateMeditation = async (req, res) => {
  try {
    const { title, description, category, duration, image, url } = req.body;

    const updatedMeditation = await Meditation.findByIdAndUpdate(
      req.params.id,
      { title, description, category, duration, image, url },
      { new: true }
    );

    if (!updatedMeditation)
      return res.status(404).json({ message: "Không tìm thấy bài thiền để cập nhật" });

    res.status(200).json({
      message: "Cập nhật bài thiền thành công",
      meditation: updatedMeditation,
    });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật bài thiền:", err);
    res.status(500).json({ message: "Lỗi khi cập nhật bài thiền" });
  }
};

// 🌿 [DELETE] /api/meditations/:id
// 👉 Xóa bài thiền (Admin only)
exports.deleteMeditation = async (req, res) => {
  try {
    const deletedMeditation = await Meditation.findByIdAndDelete(req.params.id);

    if (!deletedMeditation)
      return res.status(404).json({ message: "Không tìm thấy bài thiền để xóa" });

    res.status(200).json({ message: "Đã xóa bài thiền thành công" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa bài thiền:", err);
    res.status(500).json({ message: "Lỗi khi xóa bài thiền" });
  }
};
