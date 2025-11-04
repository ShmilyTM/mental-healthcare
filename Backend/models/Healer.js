const mongoose = require("mongoose");

const healerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    description: String,
    avatar: String,

    // 💰 Giá mỗi giờ (25k - 30k)
    pricePerHour: {
      type: Number,
      required: true,
      min: 25000,
      max: 30000,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Healer", healerSchema);
