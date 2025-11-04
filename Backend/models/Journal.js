const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  content: { type: String, required: true },
  emotion: {
    type: String,
    enum: ["hạnh phúc", "buồn bã", "lo lắng", "giận dữ", "bình yên", "căng thẳng"],
    default: "bình yên",
  },
  sentimentScore: { type: Number, min: -1, max: 1 }, // dùng AI phân tích cảm xúc
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Journal", journalSchema);
