const Payment = require("../models/Payment");
const User = require("../models/User");

// 💳 Nạp tiền
exports.depositMoney = async (req, res) => {
  try {
    const { amount, method } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    user.balance += amount;
    await user.save();

    const payment = await Payment.create({
      user: req.user._id,
      amount,
      type: "deposit",
      method,
      status: "success",
      balanceAfter: user.balance,
      description: `Nạp ${amount.toLocaleString()}₫ qua ${method}`,
    });

    res.status(201).json({
      message: "Nạp tiền thành công",
      balance: user.balance,
      payment,
    });
  } catch (err) {
    console.error("❌ Lỗi nạp tiền:", err);
    res.status(500).json({ message: "Lỗi khi nạp tiền" });
  }
};

// 💸 Thanh toán
exports.makePayment = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.balance < amount) {
      return res.status(400).json({ message: "Số dư không đủ để thanh toán" });
    }

    user.balance -= amount;
    await user.save();

    const payment = await Payment.create({
      user: req.user._id,
      amount,
      type: "payment",
      method: "system",
      status: "success",
      balanceAfter: user.balance,
      description: description || `Thanh toán ${amount.toLocaleString()}₫`,
    });

    res.status(201).json({
      message: "Thanh toán thành công",
      balance: user.balance,
      payment,
    });
  } catch (err) {
    console.error("❌ Lỗi thanh toán:", err);
    res.status(500).json({ message: "Lỗi khi thanh toán" });
  }
};

// 🧾 Xem lịch sử cá nhân
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(payments);
  } catch (err) {
    console.error("❌ Lỗi xem lịch sử:", err);
    res.status(500).json({ message: "Lỗi khi lấy lịch sử thanh toán" });
  }
};

// 📊 Quản lý tất cả giao dịch (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách thanh toán:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thanh toán" });
  }
};
