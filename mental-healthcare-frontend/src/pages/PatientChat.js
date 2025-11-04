import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { io } from "socket.io-client";
import api from "../api/axiosConfig";

export default function PatientChat() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const socket = useRef(null);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔗 Kết nối Socket.IO
  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      auth: { token },
    });

    socket.current.emit("join", user._id);

    socket.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token, user._id]);

  // 📋 Lấy danh sách bác sĩ đã từng trò chuyện / có lịch hẹn
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/chats/doctors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải danh sách bác sĩ:", err);
      }
    };
    fetchDoctors();
  }, [token]);

  // 🧠 Chọn bác sĩ → lấy lịch sử chat
  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    try {
      const res = await api.get(`/chats/${doctor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy lịch sử chat:", err);
      setMessages([]);
    }
  };

  // ✉️ Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const msgData = {
      senderId: user._id,
      receiverId: selectedDoctor._id,
      text: newMsg,
    };

    try {
      await api.post("/chats", msgData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      socket.current.emit("sendMessage", msgData);
      setMessages([...messages, { senderId: user._id, text: newMsg }]);
      setNewMsg("");
    } catch (err) {
      console.error("❌ Gửi tin nhắn thất bại:", err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        {/* 👨‍⚕️ Danh sách bác sĩ */}
        <Col md={3} className="border-end bg-light">
          <h5 className="text-center mb-3 fw-bold">👨‍⚕️ Danh sách bác sĩ</h5>
          <ListGroup>
            {doctors.map((d) => (
              <ListGroup.Item
                key={d._id}
                action
                active={selectedDoctor?._id === d._id}
                onClick={() => handleSelectDoctor(d)}
              >
                <img
                  src={d.avatar || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
                  alt="avatar"
                  width="30"
                  height="30"
                  className="rounded-circle me-2"
                />
                {d.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 💬 Khung chat */}
        <Col md={9} className="d-flex flex-column">
          {selectedDoctor ? (
            <>
              <div className="border-bottom py-2 px-3 bg-white">
                <h6 className="fw-bold mb-0 text-success">
                  {selectedDoctor.name} (Bác sĩ)
                </h6>
              </div>

              <div className="flex-grow-1 overflow-auto p-3 bg-light">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`d-flex mb-2 ${
                      m.senderId === user._id
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded ${
                        m.senderId === user._id
                          ? "bg-success text-white"
                          : "bg-white border"
                      }`}
                      style={{ maxWidth: "75%" }}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <Form onSubmit={handleSend} className="border-top p-2 bg-white">
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                  />
                  <Button type="submit" variant="success" className="ms-2">
                    Gửi
                  </Button>
                </div>
              </Form>
            </>
          ) : (
            <div className="text-center text-muted mt-5">
              Chọn bác sĩ để bắt đầu trò chuyện
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
