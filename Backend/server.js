const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const http = require("http");
const { initSocket } = require("./config/socket");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 🧠 Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// ⚙️ Tạo server HTTP & khởi tạo Socket
const server = http.createServer(app);
initSocket(server);

// =========================
// 🛣️ KHAI BÁO ROUTES CHÍNH
// =========================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/healers", require("./routes/healerRoutes"));
app.use("/api/appointments", require("./routes/appointmentRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/meditations", require("./routes/meditationRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/experts", require("./routes/expertRoutes"));
app.use("/uploads", express.static("uploads"));
app.use("/api/wallet", require("./routes/walletRoutes"));



// 📦 Cho phép truy cập file upload tĩnh
app.use("/uploads", express.static("uploads"));

// 🚀 Khởi chạy server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
