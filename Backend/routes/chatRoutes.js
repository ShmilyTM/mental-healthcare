const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getPatientsForDoctor,
  getDoctorsForPatient,
  getChatMessages,
  sendMessage,
} = require("../controllers/chatController");

// 🧠 Bác sĩ xem danh sách bệnh nhân từng chat
router.get("/patients", protect, getPatientsForDoctor);

// 🧑‍⚕️ Bệnh nhân xem danh sách bác sĩ từng chat
router.get("/doctors", protect, getDoctorsForPatient);

// 💬 Lấy lịch sử chat
router.get("/:id", protect, getChatMessages);

// ✉️ Gửi tin nhắn
router.post("/", protect, sendMessage);
const { getRecentChats } = require("../controllers/chatController");
router.get("/recent", protect, getRecentChats);

module.exports = router;
