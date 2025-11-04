// src/pages/DoctorChat.js
import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col, ListGroup, Form, Button, Card } from "react-bootstrap";
import api from "../api/axiosConfig";
import { io } from "socket.io-client";
import PatientJournals from "./PatientJournals";

export default function DoctorChat() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const socket = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ Kết nối Socket.IO
  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      auth: { token },
    });

    socket.current.on("connect", () => {
      console.log("✅ Socket connected:", socket.current.id);
    });

    socket.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [token]);

  // ✅ Lấy danh sách bệnh nhân từng có lịch hẹn
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/chats/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy danh sách bệnh nhân:", err);
      }
    };
    fetchPatients();
  }, [token]);

  // ✅ Khi chọn bệnh nhân → lấy lịch sử chat
  const handleSelectPatient = async (patient) => {
    setSelectedPatient(patient);
    try {
      const res = await api.get(`/chats/${patient._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy chat:", err);
      setMessages([]);
    }
  };

  // ✅ Gửi tin nhắn
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;

    const msgData = {
      patientId: selectedPatient._id,
      text: newMsg,
    };

    try {
      await api.post("/chats", msgData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      socket.current.emit("sendMessage", { ...msgData, sender: user._id });
      setMessages([...messages, { sender: user, text: newMsg }]);
      setNewMsg("");
    } catch (err) {
      console.error("❌ Gửi tin nhắn thất bại:", err);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        {/* 🧍 Danh sách bệnh nhân */}
        <Col md={3} className="border-end bg-light">
          <h5 className="text-center mb-3 fw-bold">🧑‍🤝‍🧑 Danh sách bệnh nhân</h5>
          <ListGroup>
            {patients.map((p) => (
              <ListGroup.Item
                key={p._id}
                action
                active={selectedPatient?._id === p._id}
                onClick={() => handleSelectPatient(p)}
              >
                <img
                  src={p.avatar || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
                  alt="avatar"
                  width="30"
                  height="30"
                  className="rounded-circle me-2"
                />
                {p.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 💬 Khung chat */}
        <Col md={5} className="d-flex flex-column">
          {selectedPatient ? (
            <>
              <div className="border-bottom py-2 px-3 bg-white">
                <h6 className="fw-bold mb-0">{selectedPatient.name}</h6>
              </div>

              <div className="flex-grow-1 overflow-auto p-3 bg-light">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`d-flex mb-2 ${
                      m.sender?._id === user._id ? "justify-content-end" : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded ${
                        m.sender?._id === user._id
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

              <Form onSubmit={sendMessage} className="border-top p-2 bg-white">
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
            <div className="text-center text-muted mt-5">Chọn bệnh nhân để bắt đầu trò chuyện</div>
          )}
        </Col>

        {/* 📖 Xem nhật ký cảm xúc */}
        <Col md={4} className="border-start bg-white">
          {selectedPatient ? (
            <PatientJournals patientId={selectedPatient._id} />
          ) : (
            <div className="text-center text-muted mt-5">Chưa chọn bệnh nhân</div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
