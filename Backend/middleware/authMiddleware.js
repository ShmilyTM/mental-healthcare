const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🧱 Middleware bảo vệ route (chỉ cho phép user có token hợp lệ)
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không có token, từ chối truy cập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Trường hợp: admin cứng
    if (decoded.id === "000000000000000000000001" && decoded.role === "admin") {
      req.user = {
        _id: "000000000000000000000001",
        name: "Super Admin",
        email: "admin@mentalcare.com",
        role: "admin",
      };
      return next();
    }

    // ✅ Lấy thông tin user từ DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Lỗi xác thực token:", err.message);
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// 🛡️ Middleware chỉ cho phép admin
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ Admin được phép truy cập" });
  }
  next();
};
