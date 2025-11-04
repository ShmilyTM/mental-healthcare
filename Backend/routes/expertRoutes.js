const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  createHealer,
  updateHealer,
  deleteHealer,
  getAllHealers,
} = require("../controllers/expertController");

// ⚙️ Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Doctor routes
router.post("/doctors", protect, adminOnly, upload.single("avatar"), createDoctor);
router.put("/doctors/:id", protect, adminOnly, upload.single("avatar"), updateDoctor);
router.delete("/doctors/:id", protect, adminOnly, deleteDoctor);
router.get("/doctors", protect, adminOnly, getAllDoctors);

// ✅ Healer routes
router.post("/healers", protect, adminOnly, upload.single("avatar"), createHealer);
router.put("/healers/:id", protect, adminOnly, upload.single("avatar"), updateHealer);
router.delete("/healers/:id", protect, adminOnly, deleteHealer);
router.get("/healers", protect, adminOnly, getAllHealers);

module.exports = router;
