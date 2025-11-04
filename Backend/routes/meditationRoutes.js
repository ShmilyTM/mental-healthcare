const express = require("express");
const router = express.Router();
const {
  getAllMeditations,
  createMeditation,
  deleteMeditation,
} = require("../controllers/meditationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, getAllMeditations);
router.post("/", protect, adminOnly, createMeditation);
router.delete("/:id", protect, adminOnly, deleteMeditation);

module.exports = router;
