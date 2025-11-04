const Chat = require("../models/Chat");
const User = require("../models/User");

// 🧠 [GET] /api/chats/patients — bác sĩ xem danh sách bệnh nhân từng có lịch hẹn hoặc chat
exports.getPatientsForDoctor = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const chats = await Chat.find({ participants: doctorId }).populate(
      "participants",
      "name avatar role"
    );

    const patients = chats
      .flatMap((c) => c.participants)
      .filter((p) => p._id.toString() !== doctorId.toString() && p.role === "customer");

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧑‍⚕️ [GET] /api/chats/doctors — bệnh nhân xem danh sách bác sĩ đã từng chat
exports.getDoctorsForPatient = async (req, res) => {
  try {
    const patientId = req.user._id;

    const chats = await Chat.find({ participants: patientId }).populate(
      "participants",
      "name avatar role"
    );

    const doctors = chats
      .flatMap((c) => c.participants)
      .filter((p) => p._id.toString() !== patientId.toString() && p.role === "doctor");

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 💬 [GET] /api/chats/:id — lấy lịch sử tin nhắn giữa user hiện tại và người khác
exports.getChatMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const otherId = req.params.id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, otherId] },
    }).populate("messages.sender", "name avatar");

    if (!chat) {
      chat = await Chat.create({ participants: [userId, otherId], messages: [] });
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✉️ [POST] /api/chats — gửi tin nhắn
exports.sendMessage = async (req, res) => {
  try {
    const { patientId, text, receiverId } = req.body;
    const senderId = req.user._id;

    const targetId = receiverId || patientId;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, targetId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [senderId, targetId], messages: [] });
    }

    const message = { sender: senderId, receiver: targetId, text };
    chat.messages.push(message);
    await chat.save();

    // Gửi realtime qua socket (nếu có io)
    const { io } = require("../config/socket");
    if (io) {
      io.to(targetId.toString()).emit("receiveMessage", {
        senderId,
        text,
        createdAt: new Date(),
      });
    }

    res.status(201).json({ message: "Gửi tin nhắn thành công", data: message });
  } catch (err) {
    console.error("❌ Lỗi gửi tin nhắn:", err);
    res.status(500).json({ message: err.message });
  }
};
// 🕐 [GET] /api/chats/recent — lấy danh sách chat gần nhất (cả bác sĩ & bệnh nhân)
exports.getRecentChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name avatar role")
      .sort({ updatedAt: -1 })
      .limit(10);

    // Định dạng dữ liệu trả về
    const formatted = chats.map((c) => {
      const other = c.participants.find(
        (p) => p._id.toString() !== userId.toString()
      );
      const lastMessage = c.messages[c.messages.length - 1];

      return {
        _id: c._id,
        user: other,
        lastMessage: lastMessage?.text || "Chưa có tin nhắn",
        lastTime: lastMessage?.createdAt || c.updatedAt,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách chat gần nhất:", err);
    res.status(500).json({ message: err.message });
  }
};
