import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import api from "../api/axiosConfig";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [balance, setBalance] = useState(0);

  // 🧾 Lấy số dư ví người dùng
  useEffect(() => {
    const fetchBalance = async () => {
      if (!token) return;
      try {
        const res = await api.get("/payments/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const totalBalance =
          res.data?.length > 0
            ? res.data
                .filter((p) => p.status === "success")
                .reduce(
                  (sum, p) =>
                    sum + (p.type === "deposit" ? p.amount : -p.amount),
                  0
                )
            : 0;
        setBalance(totalBalance);
      } catch (err) {
        console.error("❌ Lỗi lấy số dư ví:", err);
      }
    };
    fetchBalance();
  }, [token]);

  // 🚪 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="light" className="shadow-sm" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-primary d-flex align-items-center"
        >
          🧘 Mental HealthCare
        </Navbar.Brand>

        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/doctors">Chuyên gia</Nav.Link>
            <Nav.Link as={Link} to="/healers">Healer</Nav.Link>
            <Nav.Link as={Link} to="/meditations">Thiền & Chữa lành</Nav.Link>
            <Nav.Link as={Link} to="/journal">Nhật ký cảm xúc</Nav.Link>
            <Nav.Link as={Link} to="/chatbot">Chatbot AI</Nav.Link>

            {/* 🩺 Dashboard theo vai trò */}
            {user?.role === "doctor" && (
              <Nav.Link as={Link} to="/doctor/dashboard">
                Bảng điều khiển Bác sĩ
              </Nav.Link>
            )}
            {user?.role === "healer" && (
              <Nav.Link as={Link} to="/healer/dashboard">
                Bảng điều khiển Healer
              </Nav.Link>
            )}
            {user?.role === "customer" && (
              <Nav.Link as={Link} to="/patient/dashboard">
                Bảng điều khiển Khách hàng
              </Nav.Link>
            )}
            {user?.role === "admin" && (
              <Nav.Link as={Link} to="/admin/appointments">
                Trang quản trị
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {token ? (
              <>
                {/* 💰 Ví */}
                <div className="d-flex align-items-center me-3">
                  <Badge bg="success" className="me-2">
                    💰 {balance.toLocaleString()}₫
                  </Badge>
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => navigate("/payment")}
                  >
                    💳 Nạp tiền
                  </Button>
                </div>

                {/* 👤 Tài khoản */}
                <NavDropdown
                  title={`👋 ${user?.name || "Người dùng"}`}
                  id="user-menu"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/profile">
                    Thông tin cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    🚪 Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
