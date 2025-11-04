import React, { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signin", { email, password });

      const { token, user } = res.data;

      // ✅ Lưu thông tin user vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Điều hướng theo vai trò
      switch (user.role) {
        case "doctor":
          navigate("/doctor/dashboard");
          break;
        case "customer":
          navigate("/patient/dashboard");
          break;
        case "admin":
          navigate("/admin/appointments");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card className="p-4 shadow-sm" style={{ width: "100%", maxWidth: "420px" }}>
        <h3 className="text-center fw-bold mb-4 text-primary">Đăng nhập</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Đăng nhập
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
