const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expert: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "expertType",
    required: true,
  },
  expertType: {
    type: String,
    enum: ["Doctor", "Healer"],
    required: true,
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  mode: { type: String, enum: ["online", "offline"], default: "online" },
  note: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "rejected", "cancelled"], // ✅ thêm cancelled
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
