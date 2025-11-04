const mongoose = require("mongoose");

const emotionStatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  emotionCounts: {
    "hạnh phúc": { type: Number, default: 0 },
    "buồn bã": { type: Number, default: 0 },
    "lo lắng": { type: Number, default: 0 },
    "giận dữ": { type: Number, default: 0 },
    "bình yên": { type: Number, default: 0 },
    "căng thẳng": { type: Number, default: 0 },
  },
});

module.exports = mongoose.model("EmotionStat", emotionStatSchema);
