import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${id}`);
        setDoctor(res.data);
      } catch {
        alert("Không tìm thấy thông tin chuyên gia");
      }
    };
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow mx-auto" style={{ maxWidth: "700px" }}>
        <div className="text-center mb-3">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            width={180}
            height={180}
            className="rounded-circle mb-3 shadow-sm"
          />
          <h3 className="fw-bold">{doctor.name}</h3>
          <p className="text-muted">{doctor.specialization}</p>
        </div>
        <p>{doctor.bio}</p>

        <Button
          variant="success"
          className="w-100"
          onClick={() =>
            navigate(`/booking/${doctor._id}`, {
              state: { type: "doctor", name: doctor.name },
            })
          }
        >
          Đặt lịch hẹn với {doctor.name}
        </Button>
      </Card>
    </Container>
  );
}
