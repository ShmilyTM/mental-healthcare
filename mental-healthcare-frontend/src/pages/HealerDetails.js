import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function HealerDetails() {
  const { id } = useParams();
  const [healer, setHealer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHealer = async () => {
      try {
        const res = await api.get(`/healers/${id}`);
        setHealer(res.data);
      } catch {
        alert("Không tìm thấy thông tin healer");
      }
    };
    fetchHealer();
  }, [id]);

  if (!healer) return <p className="text-center mt-5">Đang tải...</p>;

  return (
    <Container className="py-5">
      <Card className="p-4 shadow mx-auto" style={{ maxWidth: "700px" }}>
        <div className="text-center mb-3">
          <img
            src={healer.avatar}
            alt={healer.name}
            width={180}
            height={180}
            className="rounded-circle mb-3 shadow-sm"
          />
          <h3 className="fw-bold">{healer.name}</h3>
          <p className="text-muted">{healer.method}</p>
        </div>
        <p>{healer.bio}</p>

        <Button
          variant="success"
          className="w-100"
          onClick={() =>
            navigate(`/booking/${healer._id}`, {
              state: { type: "healer", name: healer.name },
            })
          }
        >
          Đặt buổi chữa lành
        </Button>
      </Card>
    </Container>
  );
}
