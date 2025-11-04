const mongoose = require("mongoose");

const meditationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề bài thiền"],
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "Chữa lành",
    },
    duration: {
      type: String,
      default: "10 phút",
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    url: {
      // link đến file audio hoặc video thiền
      type: String,
      required: [true, "Vui lòng cung cấp đường dẫn file âm thanh hoặc video"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meditation", meditationSchema);
