import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import api from "../api/axiosConfig";
import RecentChats from "../components/RecentChats";

export default function HealerDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // 🧘‍♀️ Lấy danh sách lịch hẹn của healer
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/healer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data || []);
      } catch (err) {
        console.error("❌ Lỗi lấy lịch hẹn healer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  // ✅ Xác nhận lịch
  const handleConfirm = async (id) => {
    try {
      await api.patch(`/appointments/healer/confirm/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Đã xác nhận lịch hẹn!");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "confirmed" } : a
        )
      );
    } catch (err) {
      console.error("Confirm error:", err);
      alert(err.response?.data?.message || "Lỗi xác nhận lịch hẹn!");
    }
  };

  // ❌ Hủy lịch
  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;

    try {
      await api.patch(`/appointments/healer/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("❌ Đã hủy lịch hẹn!");
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status: "cancelled" } : a
        )
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert(err.response?.data?.message || "Không thể hủy lịch hẹn!");
    }
  };

  return (
    <Container className="py-4">
      <h3 className="fw-bold text-success mb-4">🧘‍♀️ Bảng điều khiển Healer</h3>

      <Row className="g-4">
        {/* 📅 Lịch hẹn */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold bg-success text-white">
              📅 Lịch hẹn sắp tới
            </Card.Header>
            <Card.Body>
              {loading ? (
                <Spinner animation="border" />
              ) : appointments.length === 0 ? (
                <p className="text-muted">Chưa có lịch hẹn nào</p>
              ) : (
                <ListGroup>
                  {appointments.map((a) => (
                    <ListGroup.Item
                      key={a._id}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{a.customer?.name}</strong> —{" "}
                        {new Date(a.date).toLocaleDateString()} ({a.time})
                        <div className="small text-muted">{a.mode}</div>
                        <div className="small">
                          Trạng thái:{" "}
                          <span
                            className={
                              a.status === "cancelled"
                                ? "text-danger"
                                : a.status === "confirmed"
                                ? "text-success"
                                : "text-warning"
                            }
                          >
                            {a.status}
                          </span>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        {a.status === "pending" && (
                          <>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleConfirm(a._id)}
                            >
                              Xác nhận
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancel(a._id)}
                            >
                              Hủy
                            </Button>
                          </>
                        )}
                        {a.status === "confirmed" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleCancel(a._id)}
                          >
                            Hủy
                          </Button>
                        )}
                      </div>
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
            <Card.Header className="fw-bold bg-light">
              💬 Chat gần đây
            </Card.Header>
            <Card.Body>
              <RecentChats userRole="healer" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
