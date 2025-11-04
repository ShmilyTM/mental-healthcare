const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getBalance, addBalance } = require("../controllers/walletController");

router.get("/me", protect, getBalance);   // Lấy thông tin ví
router.post("/add", protect, addBalance); // Nạp tiền

module.exports = router;
