import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SidebarDoctor() {
  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: "220px" }}>
      <h5 className="text-primary fw-bold mb-3">👩‍⚕️ Bác sĩ</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/doctor/dashboard">🏠 Trang chủ</Nav.Link>
        <Nav.Link as={Link} to="/doctor/chat">💬 Trò chuyện</Nav.Link>
        <Nav.Link as={Link} to="/doctor/patients">📖 Nhật ký bệnh nhân</Nav.Link>
        <Nav.Link as={Link} to="/profile">👤 Hồ sơ</Nav.Link>
      </Nav>
    </div>
  );
}
