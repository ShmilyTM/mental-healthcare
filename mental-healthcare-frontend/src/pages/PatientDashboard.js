import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Spinner } from "react-bootstrap";
import api from "../api/axiosConfig";
import RecentChats from "../components/RecentChats";

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi lấy lịch hẹn:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  return (
    <Container className="py-4">
      <h3 className="fw-bold text-primary mb-4">👩‍💼 Bảng điều khiển Bệnh nhân</h3>

      <Row className="g-4">
        {/* 📅 Lịch hẹn của tôi */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold bg-primary text-white">
              📅 Lịch hẹn của tôi
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Spinner animation="border" />
              ) : appointments.length === 0 ? (
                <p className="text-muted">Bạn chưa đặt lịch hẹn nào</p>
              ) : (
                <ListGroup>
                  {appointments.map((a) => (
                    <ListGroup.Item key={a._id}>
                      <strong>{a.expert?.name}</strong> —{" "}
                      {new Date(a.date).toLocaleDateString()} ({a.time})
                      <div className="small text-muted">{a.mode}</div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 💬 Chat gần đây */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold bg-light">💬 Chat gần đây</Card.Header>
            <Card.Body>
              <RecentChats userRole="patient" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
