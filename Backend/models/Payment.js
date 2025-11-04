const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["deposit", "payment"],
      required: true,
    },
    method: {
      type: String,
      enum: ["bank", "momo", "paypal", "system"],
      default: "system",
    },
    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "success",
    },
    description: { type: String },
    balanceAfter: { type: Number }, // số dư sau giao dịch
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
