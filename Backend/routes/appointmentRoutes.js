const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  getDoctorAppointments,
  cancelByDoctor,
  getHealerAppointments,
  confirmByHealer,
  cancelByHealer,
} = require("../controllers/appointmentController");

// 👩‍🦰 Customer
router.post("/", protect, createAppointment);
router.get("/me", protect, getMyAppointments);
router.delete("/:id", protect, cancelAppointment);

// 👨‍💼 Admin
router.get("/", protect, adminOnly, getAllAppointments);
router.patch("/:id/status", protect, adminOnly, updateAppointmentStatus);

// 👨‍⚕️ Doctor
router.get("/doctor", protect, getDoctorAppointments);
router.patch("/doctor/cancel/:id", protect, cancelByDoctor);

// 🧘‍♀️ Healer
router.get("/healer", protect, getHealerAppointments);
router.patch("/healer/confirm/:id", protect, confirmByHealer);
router.patch("/healer/cancel/:id", protect, cancelByHealer);

module.exports = router;
