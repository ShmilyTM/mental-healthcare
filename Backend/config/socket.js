// config/socket.js
const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // 📌 Khi client join room theo userId
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👥 User ${userId} joined their room`);
    });

    // 💬 Khi nhận tin nhắn mới từ client
    socket.on("sendMessage", (data) => {
      const { senderId, receiverId, text } = data;
      console.log(`📨 Message from ${senderId} → ${receiverId}: ${text}`);

      // ✅ Gửi tin nhắn tới người nhận (room của receiverId)
      io.to(receiverId).emit("receiveMessage", {
        senderId,
        text,
        createdAt: new Date(),
      });

      // 🔁 Đồng thời phản hồi lại cho người gửi (để cập nhật UI ngay)
      io.to(senderId).emit("messageDelivered", {
        text,
        receiverId,
        createdAt: new Date(),
      });
    });

    // 🔴 Khi user disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
}

// 👉 Cho phép import ở nơi khác
module.exports = { initSocket, io };
