import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Spinner } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/axiosConfig";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

export default function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [journals, setJournals] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // 🧠 Lấy danh sách nhật ký & thống kê cảm xúc
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [journalRes, statRes] = await Promise.all([
          api.get("/journals", { headers: { Authorization: `Bearer ${token}` } }),
          api.get("/journals/stats/all", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setJournals(journalRes.data || []);
        setStats(statRes.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải dữ liệu nhật ký:", err);
      }
    };
    fetchData();
  }, [token]);

  // ✏️ Gửi nhật ký cảm xúc
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("Vui lòng nhập nội dung cảm xúc!");

    setLoading(true);
    try {
      await api.post(
        "/journals",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTitle("");
      setContent("");
      alert("🧘 Nhật ký của bạn đã được lưu!");

      // Reload danh sách & biểu đồ
      const [journalRes, statRes] = await Promise.all([
        api.get("/journals", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/journals/stats/all", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setJournals(journalRes.data || []);
      setStats(statRes.data || []);
    } catch (err) {
      console.error("❌ Lỗi khi lưu nhật ký:", err);
      alert(err.response?.data?.message || "Không thể lưu nhật ký cảm xúc!");
    } finally {
      setLoading(false);
    }
  };

  // 📊 Chuẩn bị dữ liệu biểu đồ cảm xúc
  const chartData = {
    labels: stats.map((s) => new Date(s.date).toLocaleDateString("vi-VN")),
    datasets: [
      {
        label: "Số lượng cảm xúc ghi nhận trong ngày",
        data: stats.map((s) =>
          Object.values(s.emotionCounts || {}).reduce((sum, count) => sum + count, 0)
        ),
        borderColor: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <Container className="py-5">
      <h2 className="fw-bold text-center text-success mb-4">🌿 Nhật ký cảm xúc</h2>

      <Row>
        {/* ✍️ Form viết nhật ký */}
        <Col md={6}>
          <Card className="p-4 shadow-sm mb-4 border-0">
            <h5 className="fw-semibold mb-3">Viết cảm xúc hôm nay</h5>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tiêu đề</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ví dụ: Một ngày bình yên..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Cảm xúc của bạn</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Chia sẻ suy nghĩ, cảm xúc của bạn hôm nay..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Đang lưu...
                  </>
                ) : (
                  "🩵 Lưu nhật ký cảm xúc"
                )}
              </Button>
            </Form>
          </Card>
        </Col>

        {/* 📈 Biểu đồ cảm xúc */}
        <Col md={6}>
          <Card className="p-4 shadow-sm mb-4 border-0">
            <h5 className="fw-semibold text-center mb-3">📊 Biểu đồ cảm xúc</h5>
            {stats.length > 0 ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: "bottom" },
                  },
                }}
              />
            ) : (
              <p className="text-muted text-center">Chưa có dữ liệu thống kê</p>
            )}
          </Card>
        </Col>
      </Row>

      {/* 📝 Danh sách nhật ký */}
      <Row className="mt-4">
        <h5 className="fw-semibold text-success mb-3">📝 Nhật ký gần đây</h5>
        {journals.length === 0 ? (
          <p className="text-muted text-center">Chưa có nhật ký nào.</p>
        ) : (
          journals.map((j) => (
            <Col md={6} key={j._id} className="mb-3">
              <Card className="p-3 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="fw-semibold">{j.title || "Không có tiêu đề"}</h6>
                    <p className="mt-2 text-muted mb-1">{j.content}</p>
                    <small className="text-muted">
                      {new Date(j.createdAt).toLocaleString("vi-VN")}
                    </small>
                  </div>
                  <Badge
                    bg={
                      j.emotion === "hạnh phúc"
                        ? "success"
                        : j.emotion === "buồn bã"
                        ? "secondary"
                        : j.emotion === "lo lắng"
                        ? "warning"
                        : j.emotion === "giận dữ"
                        ? "danger"
                        : j.emotion === "căng thẳng"
                        ? "info"
                        : "light"
                    }
                    text={j.emotion === "bình yên" ? "dark" : "light"}
                  >
                    {j.emotion}
                  </Badge>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
