const express = require("express");
const router = express.Router();
const {
  getDoctors,
  getDoctorById,
  updateSchedule,
  viewAppointments,
  updateAppointmentStatus,
  addConsultationNote,
} = require("../controllers/doctorController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Danh sách
router.get("/", getDoctors);

// ✅ Chi tiết bác sĩ theo ID
router.get("/:id", getDoctorById);

router.put("/schedule", protect, updateSchedule);
router.get("/appointments", protect, viewAppointments);
router.put("/appointment/:id/status", protect, updateAppointmentStatus);
router.put("/appointment/:id/note", protect, addConsultationNote);

module.exports = router;
