const axios = require("axios");

exports.askChatbot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ message: "Vui lòng nhập nội dung câu hỏi." });

    // Gọi OpenAI Responses API (chuẩn mới)
    const response = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: "gpt-4.1-mini", // Hoặc gpt-4o-mini nếu bạn có quyền truy cập
        input: [
          {
            role: "system",
            content:
              "Bạn là MINDY - chatbot tư vấn tâm lý thân thiện thuộc hệ thống Mental HealthCare. Hãy trả lời ngắn gọn, nhẹ nhàng, đồng cảm và hướng người dùng đến sự thư giãn, tích cực.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Lấy nội dung phản hồi từ API mới
    const reply =
      response.data.output?.[0]?.content?.[0]?.text ||
      "Xin lỗi, MINDY chưa thể phản hồi lúc này.";

    res.json({ reply });
  } catch (err) {
    console.error("❌ Lỗi Chatbot:", err.response?.data || err.message);
    res.status(500).json({
      message: "Chatbot hiện đang bận, vui lòng thử lại sau.",
      error: err.response?.data || err.message,
    });
  }
};
