import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SidebarAdmin() {
  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: "220px" }}>
      <h5 className="text-danger fw-bold mb-3">🛠️ Quản trị viên</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/appointments">📅 Quản lý lịch hẹn</Nav.Link>
        <Nav.Link as={Link} to="/admin/users">👥 Quản lý người dùng</Nav.Link>
        <Nav.Link as={Link} to="/profile">👤 Hồ sơ cá nhân</Nav.Link>
      </Nav>
    </div>
  );
}
