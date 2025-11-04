// src/pages/PatientJournals.js
import React, { useEffect, useState } from "react";
import { Card, Spinner, ListGroup } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function PatientJournals({ patientId }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await api.get(`/journals/patient/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJournals(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy nhật ký:", err);
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchJournals();
  }, [patientId, token]);

  if (loading) return <Spinner animation="border" className="mt-5 text-center" />;

  return (
    <div className="p-3">
      <h6 className="fw-bold mb-3 text-primary text-center">📖 Nhật ký cảm xúc</h6>
      {journals.length === 0 ? (
        <p className="text-muted text-center">Bệnh nhân này chưa có nhật ký nào.</p>
      ) : (
        <ListGroup>
          {journals.map((j) => (
            <ListGroup.Item key={j._id} className="mb-2 border rounded">
              <div className="fw-bold text-success">{j.mood}</div>
              <div>{j.content}</div>
              <small className="text-muted">{new Date(j.createdAt).toLocaleString()}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}
