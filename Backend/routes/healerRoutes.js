const express = require("express");
const router = express.Router();
const {
  getHealers,
  getHealerById,
  updateSchedule,
  updateEarnings,
} = require("../controllers/healerController");
const { protect } = require("../middleware/authMiddleware");

// Danh sách healer
router.get("/", getHealers);

// Chi tiết healer theo ID
router.get("/:id", getHealerById);

// Cập nhật lịch làm việc
router.put("/schedule", protect, updateSchedule);

// Cập nhật thu nhập
router.put("/earnings", protect, updateEarnings);

module.exports = router;
