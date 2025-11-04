import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function SidebarPatient() {
  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: "220px" }}>
      <h5 className="text-success fw-bold mb-3">🧘 Bệnh nhân</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/patient/dashboard">🏠 Trang chủ</Nav.Link>
        <Nav.Link as={Link} to="/journal">📔 Nhật ký cảm xúc</Nav.Link>
        <Nav.Link as={Link} to="/profile">👤 Hồ sơ</Nav.Link>
        <Nav.Link as={Link} to="/payment">💰 Ví & Nạp tiền</Nav.Link>
      </Nav>
    </div>
  );
}
