const express = require("express");
const router = express.Router();
const { sendNotification, getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/", protect, adminOnly, sendNotification);
router.get("/my", protect, getNotifications);
router.put("/:id/read", protect, markAsRead);

module.exports = router;
