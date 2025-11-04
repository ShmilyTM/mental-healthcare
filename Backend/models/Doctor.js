const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  avatar: { type: String },
  specialization: { type: String },
  experience: { type: String },
  bio: { type: String },
  verified: { type: Boolean, default: false },
  certificates: [String],
  schedule: [
    {
      day: String,
      timeSlots: [String],
    },
  ],
  earnings: { type: Number, default: 0 },
});

module.exports = mongoose.model("Doctor", doctorSchema);
