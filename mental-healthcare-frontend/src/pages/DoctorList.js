import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ✅ import thêm
import api from "../api/axiosConfig";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // ✅ tạo biến điều hướng

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/doctors");
        setDoctors(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách chuyên gia:", err);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="fw-bold text-center text-success mb-4">
          🩺 Danh sách chuyên gia tâm lý
        </h2>

        {/* Thanh tìm kiếm */}
        <Row className="justify-content-center mb-4">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Tìm chuyên gia theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shadow-sm"
            />
          </Col>
        </Row>

        {/* Danh sách chuyên gia */}
        <Row xs={1} md={3} className="g-4">
          {filteredDoctors.length === 0 ? (
            <p className="text-center text-muted">
              Không tìm thấy chuyên gia phù hợp.
            </p>
          ) : (
            filteredDoctors.map((d) => (
              <Col key={d._id}>
                <Card
                  className="shadow-sm border-0 card-hover text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/doctors/${d._id}`)} // ✅ bấm vào card cũng chuyển
                >
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={d.avatar || "https://via.placeholder.com/320x320"}
                      alt={d.name}
                      style={{
                        height: "320px",
                        objectFit: "cover",
                        transition: "0.4s ease",
                      }}
                    />
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{d.name}</Card.Title>
                    <Card.Text className="text-muted">
                      {d.specialization || "Tâm lý trị liệu tổng quát"}
                    </Card.Text>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="rounded-pill"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ ngăn trùng click card
                        navigate(`/doctors/${d._id}`);
                      }}
                    >
                      Đặt lịch hẹn
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
