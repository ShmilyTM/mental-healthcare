// src/components/RecentChats.js
import React, { useEffect, useState } from "react";
import { ListGroup, Spinner, Badge } from "react-bootstrap";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function RecentChats({ userRole }) {
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get("/chats/recent", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentChats(res.data);
      } catch (err) {
        console.error("❌ Lỗi tải danh sách chat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, [token]);

  if (loading) return <Spinner animation="border" className="mt-3" />;

  if (recentChats.length === 0)
    return <p className="text-muted text-center mt-3">Chưa có cuộc trò chuyện nào</p>;

  const handleClick = (chat) => {
    if (userRole === "doctor") {
      navigate("/doctor/chat", { state: { selectedPatient: chat.user } });
    } else {
      navigate("/patient/chat", { state: { selectedDoctor: chat.user } });
    }
  };

  return (
    <ListGroup variant="flush" className="shadow-sm rounded border">
      {recentChats.map((chat) => (
        <ListGroup.Item
          key={chat._id}
          action
          onClick={() => handleClick(chat)}
          className="d-flex align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center">
            <img
              src={chat.user.avatar || "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"}
              alt="avatar"
              width="40"
              height="40"
              className="rounded-circle me-2"
            />
            <div>
              <strong>{chat.user.name}</strong>
              <div className="text-muted small">{chat.lastMessage}</div>
            </div>
          </div>
          <Badge bg="light" text="dark">
            {new Date(chat.lastTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
