const express = require("express");
const router = express.Router();
const { createReport, getAllReports, updateReportStatus } = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, createReport);
router.get("/", protect, adminOnly, getAllReports);
router.put("/:id", protect, adminOnly, updateReportStatus);

module.exports = router;
