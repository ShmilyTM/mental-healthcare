const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "doctor", "healer", "admin"],
      default: "customer",
    },
    avatar: { type: String },
    phone: { type: String },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    suspended: { type: Boolean, default: false },
    specialization: { type: String },
    experience: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false },
    resetOTP: String,
    resetOTPExpire: Date,

    // 💰 Số dư & Lịch sử giao dịch
    balance: { type: Number, default: 0 },
    transactions: [
      {
        type: { type: String, enum: ["deposit", "payment"], default: "deposit" },
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
