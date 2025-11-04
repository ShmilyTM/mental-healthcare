const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  depositMoney,
  makePayment,
  getMyPayments,
  getAllPayments,
} = require("../controllers/paymentController");

// ✅ Nạp tiền
router.post("/deposit", protect, depositMoney);

// ✅ Thanh toán
router.post("/pay", protect, makePayment);

// ✅ Xem lịch sử cá nhân
router.get("/my", protect, getMyPayments);

// ✅ Xem tất cả giao dịch (admin)
router.get("/all", protect, adminOnly, getAllPayments);

module.exports = router;
