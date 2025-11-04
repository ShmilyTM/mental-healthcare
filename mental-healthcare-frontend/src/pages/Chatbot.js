import React, { useState } from "react";
import { Container, Card, Form, Button, Spinner, Badge } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Xin chào 💚 Mình là MINDY – chatbot hỗ trợ tâm lý. Hôm nay bạn cảm thấy thế nào?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Các gợi ý nhanh
  const quickReplies = [
    "Tôi đang cảm thấy căng thẳng 😞",
    "Tôi muốn học cách hít thở sâu 🧘‍♀️",
    "Gợi ý bài thiền giúp tôi thư giãn ✨",
    "Tôi cảm thấy cô đơn 🥺",
    "Tôi muốn nói chuyện với chuyên gia 👩‍⚕️",
  ];

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chatbot", { message: text });
      const reply = res.data.reply;
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Xin lỗi 😔, hiện tại MINDY chưa thể phản hồi. Bạn hãy thử lại sau nhé.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg mx-auto" style={{ maxWidth: "700px" }}>
        <Card.Header className="bg-success text-white text-center">
          💬 Chat cùng MINDY
        </Card.Header>

        <Card.Body
          style={{
            height: "450px",
            overflowY: "auto",
            background: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "10px 20px",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`d-flex ${
                msg.sender === "user" ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div
                className={`p-2 rounded-3 ${
                  msg.sender === "user" ? "bg-primary text-white" : "bg-light text-dark"
                }`}
                style={{ maxWidth: "75%" }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center">
              <Spinner animation="border" size="sm" variant="success" />
              <span className="ms-2 text-muted">MINDY đang suy nghĩ...</span>
            </div>
          )}
        </Card.Body>

        {/* Gợi ý nhanh */}
        <div className="d-flex flex-wrap gap-2 p-3 bg-light border-top">
          {quickReplies.map((text, i) => (
            <Badge
              key={i}
              bg="success"
              style={{ cursor: "pointer", padding: "10px" }}
              onClick={() => sendMessage(text)}
            >
              {text}
            </Badge>
          ))}
        </div>

        <Card.Footer>
          <Form onSubmit={handleSubmit} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button type="submit" variant="success" className="ms-2">
              Gửi
            </Button>
          </Form>
        </Card.Footer>
      </Card>
    </Container>
  );
}
