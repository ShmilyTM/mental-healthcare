const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createJournal,
  getMyJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  getEmotionStats,
} = require("../controllers/journalController");

// 🧘 Viết nhật ký cảm xúc
router.post("/", protect, createJournal);

// 📖 Lấy danh sách nhật ký của user
router.get("/", protect, getMyJournals);

// 📊 Lấy thống kê cảm xúc (⚠️ đặt TRƯỚC route /:id)
router.get("/stats/all", protect, getEmotionStats);

// 🔍 Lấy chi tiết nhật ký
router.get("/:id", protect, getJournalById);

// ✏️ Cập nhật nhật ký
router.patch("/:id", protect, updateJournal);

// 🗑 Xóa nhật ký
router.delete("/:id", protect, deleteJournal);

module.exports = router;
