const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: {
    type: String,
    enum: ["system", "payment", "appointment", "chat", "other"],
    default: "other",
  },
  message: { type: String, required: true },
  status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  adminNote: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
