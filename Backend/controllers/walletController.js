const User = require("../models/User");

// 💰 Nạp tiền
exports.addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Số tiền không hợp lệ" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Tăng số dư
    user.balance += Number(amount);

    // Ghi lại lịch sử giao dịch
    user.transactions.push({
      type: "deposit",
      amount: Number(amount),
      date: new Date(),
    });

    await user.save();

    res.json({
      message: `Đã nạp ${Number(amount).toLocaleString()}đ vào tài khoản`,
      balance: user.balance,
      transactions: user.transactions,
    });
  } catch (err) {
    console.error("❌ Lỗi nạp tiền:", err);
    res.status(500).json({ message: "Lỗi khi nạp tiền" });
  }
};

// 📊 Lấy thông tin ví
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("balance transactions");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    res.json({
      balance: user.balance,
      transactions: user.transactions || [],
    });
  } catch (err) {
    console.error("❌ Lỗi lấy số dư:", err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin ví" });
  }
};
