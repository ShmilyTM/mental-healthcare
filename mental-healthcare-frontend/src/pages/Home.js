import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [healers, setHealers] = useState([]);

  useEffect(() => {
  const fetchData = async () => {
    const docRes = await api.get("/doctors");
    const healRes = await api.get("/healers");
    setDoctors(docRes.data.slice(0, 3)); // chỉ lấy 3 chuyên gia đầu tiên
    setHealers(healRes.data.slice(0, 3)); // chỉ lấy 3 healer đầu tiên
  };
  fetchData();
}, []);


  return (
    <>
      {/* 🌈 HERO SECTION */}
      <section
        className="hero-section d-flex align-items-center justify-content-center text-center text-light"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "85vh",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            position: "absolute",
            inset: 0,
          }}
        ></div>
        <div style={{ position: "relative", zIndex: 2, maxWidth: "720px" }}>
          <h1 className="display-5 fw-bold mb-3">Hành trình chữa lành tâm hồn 🌿</h1>
          <p className="lead mb-4">
            Đồng hành cùng bạn trên con đường tìm lại sự bình an, hiểu và yêu thương bản thân nhiều hơn mỗi ngày.
          </p>
          <Button variant="light" size="lg" className="rounded-pill px-4">
            Đặt lịch tư vấn
          </Button>
        </div>
      </section>

      {/* 💫 VÌ SAO CHỌN CHÚNG TÔI */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center g-5">
            <Col md={6}>
              <Image
                src="https://top10binhduong.com.vn/wp-content/uploads/2024/08/top-5-bac-si-tam-ly-binh-duong-dang-tin-cay-nhat-hien-nay-1408-2.jpg"
                alt="Therapy session"
                rounded
                fluid
              />
            </Col>
            <Col md={6}>
              <h2 className="fw-bold text-primary mb-3">Vì sao chọn chúng tôi?</h2>
              <p className="text-muted mb-3">
                <strong>Mental HealthCare</strong> là nơi kết hợp giữa trị liệu tâm lý và chữa lành cảm xúc,
                giúp bạn kết nối sâu sắc hơn với chính mình thông qua:
              </p>
              <ul className="text-muted">
                <li>🌸 Chuyên gia được chứng nhận chuyên môn và giàu kinh nghiệm.</li>
                <li>🌿 Phương pháp trị liệu cá nhân hóa theo từng giai đoạn cảm xúc.</li>
                <li>🕯️ Không gian thư giãn, an toàn, bảo mật tuyệt đối.</li>
                <li>🧘 Hoạt động thiền & chữa lành tinh thần đa dạng.</li>
              </ul>
              <Button variant="success" className="rounded-pill px-4 mt-3">
                Tư vấn ngay
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 🩺 ĐỘI NGŨ CHUYÊN GIA */}
      <section className="py-5 bg-light">
        <Container>
          <h3 className="fw-bold text-center mb-5 text-success">🩺 Đội ngũ chuyên gia tâm lý</h3>
          <Row xs={1} md={3} className="g-4">
            {doctors.map((d) => (
              <Col key={d._id}>
                <Card className="shadow-sm border-0 card-hover text-center">
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={d.avatar}
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
                    <Card.Text className="text-muted">{d.specialization}</Card.Text>
                    <Button variant="outline-success" size="sm" className="rounded-pill">
                      Đặt lịch hẹn
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🧘 HEALER ĐỒNG HÀNH */}
      <section className="py-5 bg-white">
        <Container>
          <h3 className="fw-bold text-center mb-5 text-primary">🧘 Các Healer đồng hành</h3>
          <Row xs={1} md={3} className="g-4">
            {healers.map((h) => (
              <Col key={h._id}>
                <Card className="shadow-sm border-0 card-hover text-center">
                  <div className="overflow-hidden">
                    <Card.Img
                      variant="top"
                      src={h.avatar}
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
                    <Card.Text className="text-muted">{h.specialization}</Card.Text>
                    <Button variant="outline-primary" size="sm" className="rounded-pill">
                      Kết nối ngay
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🌷 QUOTE TRUYỀN CẢM HỨNG */}
      <section
        className="py-5 text-center text-light"
        style={{
          background: "linear-gradient(135deg, #88c9bf, #6fa3a0)",
        }}
      >
        <Container>
          <blockquote className="fs-4 fst-italic">
            “Chữa lành không phải là xóa bỏ quá khứ, mà là học cách mỉm cười với nó.” 🌸
          </blockquote>
          <p className="mt-3">— Mental HealthCare Team</p>
        </Container>
      </section>
    </>
  );
}
