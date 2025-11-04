const Journal = require("../models/Journal");
const EmotionStat = require("../models/EmotionStat");
const axios = require("axios");

// 🧘 [POST] Tạo nhật ký cảm xúc
exports.createJournal = async (req, res) => {
  try {
    const { title, content } = req.body;

    let emotion = "bình yên";
    let sentimentScore = 0;

    // 🧠 Phân tích cảm xúc bằng OpenAI nếu có API key
    if (process.env.OPENAI_API_KEY) {
      try {
        const aiRes = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Bạn là AI phân tích cảm xúc tiếng Việt. Hãy đọc đoạn văn và đánh giá cảm xúc tổng quan.",
              },
              {
                role: "user",
                content: `Phân tích cảm xúc của đoạn sau: "${content}". 
                Trả về JSON: {"emotion": "...", "sentimentScore": (từ -1 đến 1)}.`,
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          }
        );

        const aiText = aiRes.data?.choices?.[0]?.message?.content;
        if (aiText) {
          const parsed = JSON.parse(aiText);
          emotion = parsed.emotion || "bình yên";
          sentimentScore = parsed.sentimentScore || 0;
        }
      } catch (aiErr) {
        console.warn("⚠️ Không thể gọi OpenAI API:", aiErr.message);
      }
    }

    // 💾 Lưu journal
    const journal = await Journal.create({
      user: req.user.id,
      title,
      content,
      emotion,
      sentimentScore,
    });

    // 📊 Cập nhật thống kê cảm xúc trong ngày
    const date = new Date().toISOString().split("T")[0];
    let stat = await EmotionStat.findOne({ user: req.user.id, date });
    if (!stat) stat = new EmotionStat({ user: req.user.id, date });
    stat.emotionCounts[emotion] = (stat.emotionCounts[emotion] || 0) + 1;
    await stat.save();

    res.status(201).json({
      message: "✅ Đã lưu nhật ký cảm xúc thành công",
      journal,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo nhật ký:", err);
    res.status(500).json({ message: "Không thể ghi nhật ký, vui lòng thử lại sau!" });
  }
};

// 📖 [GET] Lấy danh sách nhật ký của người dùng
exports.getMyJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(journals);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách nhật ký:", err);
    res.status(500).json({ message: "Không thể tải danh sách nhật ký!" });
  }
};

// 🔍 [GET] Xem chi tiết nhật ký
exports.getJournalById = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal)
      return res.status(404).json({ message: "Không tìm thấy nhật ký này!" });

    if (journal.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Không có quyền truy cập!" });

    res.json(journal);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết nhật ký:", err);
    res.status(500).json({ message: "Không thể tải chi tiết nhật ký!" });
  }
};

// ✏️ [PATCH] Cập nhật nhật ký
exports.updateJournal = async (req, res) => {
  try {
    const { title, content } = req.body;

    const journal = await Journal.findById(req.params.id);
    if (!journal)
      return res.status(404).json({ message: "Không tìm thấy nhật ký!" });

    if (journal.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Không có quyền chỉnh sửa!" });

    journal.title = title || journal.title;
    journal.content = content || journal.content;
    await journal.save();

    res.json({ message: "✅ Cập nhật nhật ký thành công!", journal });
  } catch (err) {
    console.error("❌ Lỗi cập nhật nhật ký:", err);
    res.status(500).json({ message: "Không thể cập nhật nhật ký!" });
  }
};

// 🗑 [DELETE] Xóa nhật ký
exports.deleteJournal = async (req, res) => {
  try {
    const journal = await Journal.findById(req.params.id);
    if (!journal)
      return res.status(404).json({ message: "Không tìm thấy nhật ký!" });

    if (journal.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Không có quyền xóa nhật ký!" });

    await journal.deleteOne();
    res.json({ message: "🗑 Đã xóa nhật ký thành công!" });
  } catch (err) {
    console.error("❌ Lỗi xóa nhật ký:", err);
    res.status(500).json({ message: "Không thể xóa nhật ký!" });
  }
};

// 📊 [GET] Thống kê cảm xúc theo ngày
exports.getEmotionStats = async (req, res) => {
  try {
    const stats = await EmotionStat.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(stats);
  } catch (err) {
    console.error("❌ Lỗi lấy thống kê cảm xúc:", err);
    res.status(500).json({ message: "Không thể tải thống kê cảm xúc!" });
  }
};
