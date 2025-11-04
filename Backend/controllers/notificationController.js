const Notification = require("../models/Notification");
const { io } = require("../config/socket");

// [POST] Gửi thông báo (realtime)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    const notify = new Notification({ user: userId, title, message });
    await notify.save();

    // Gửi realtime qua Socket.IO
    if (io) io.to(userId).emit("notification", { title, message });

    res.status(201).json({ message: "Đã gửi thông báo", notify });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [GET] Người dùng xem danh sách thông báo
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// [PUT] Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const notify = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json({ message: "Đã đánh dấu đã đọc", notify });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
