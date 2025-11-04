import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function HealerList() {
  const [healers, setHealers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealers = async () => {
      try {
        const res = await api.get("/healers");
        setHealers(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách healer:", err);
      }
    };
    fetchHealers();
  }, []);

  const filteredHealers = healers.filter((h) =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="fw-bold text-center text-success mb-4">
          🌿 Danh sách Healer
        </h2>

        {/* Thanh tìm kiếm */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Tìm healer theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shadow-sm"
            />
          </Col>
        </Row>

        {/* Danh sách healer */}
        <Row xs={1} md={3} className="g-4">
          {filteredHealers.length === 0 ? (
            <p className="text-center text-muted">Không tìm thấy healer phù hợp.</p>
          ) : (
            filteredHealers.map((h) => (
              <Col key={h._id}>
                <Card
                  className="shadow-sm border-0 card-hover text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/healers/${h._id}`)} // ✅ click card → chi tiết
                >
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={h.avatar || "https://via.placeholder.com/320x320"}
                      alt={h.name}
                      style={{
                        height: "320px",
                        objectFit: "cover",
                        transition: "0.4s ease",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{h.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {h.method || "Chuyên gia chữa lành năng lượng"}
                    </Card.Text>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ tránh click trùng
                        navigate(`/healers/${h._id}`);
                      }}
                    >
                      ✨ Đặt buổi chữa lành
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </section>
  );
}
