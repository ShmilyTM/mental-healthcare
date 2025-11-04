import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function Meditation() {
  const [meditations, setMeditations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const res = await api.get("/meditations");
        setMeditations(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách bài thiền:", err);
      }
    };
    fetchMeditations();
  }, []);

  const filteredMeditations = meditations.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="fw-bold text-center text-success mb-4">
          🧘 Bộ sưu tập các bài thiền thư giãn
        </h2>

        {/* Thanh tìm kiếm */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Tìm bài thiền theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shadow-sm"
            />
          </Col>
        </Row>

        {/* Danh sách bài thiền */}
        <Row xs={1} md={3} className="g-4">
          {filteredMeditations.length === 0 ? (
            <p className="text-center text-muted">Không tìm thấy bài thiền phù hợp.</p>
          ) : (
            filteredMeditations.map((m) => (
              <Col key={m._id}>
                <Card className="shadow-sm border-0 meditation-card">
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={m.image}
                      alt={m.title}
                      style={{
                        height: "240px",
                        objectFit: "cover",
                        transition: "0.4s ease",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{m.title}</Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      {m.description?.slice(0, 100) + "..."}
                    </Card.Text>
                    <p className="text-success fw-semibold">{m.duration}</p>

                    {/* Audio player */}
                    {m.audioUrl && (
                      <audio controls style={{ width: "100%" }}>
                        <source src={m.audioUrl} type="audio/mpeg" />
                        Trình duyệt của bạn không hỗ trợ phát nhạc.
                      </audio>
                    )}

                    <div className="text-center mt-3">
                      <Button variant="outline-success" size="sm" className="rounded-pill">
                        Nghe toàn bài
                      </Button>
                    </div>
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
