import React, { useEffect, useState } from "react";
import { Container, Table, Badge, Button, Form } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      alert("Lỗi khi tải danh sách lịch hẹn.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/appointments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Đã cập nhật trạng thái thành "${newStatus}"`);
      fetchAppointments();
    } catch {
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  return (
    <Container className="py-5">
      <h3 className="fw-bold text-center text-success mb-4">
        🗓️ Quản lý lịch hẹn
      </h3>

      {appointments.length === 0 ? (
        <p className="text-center text-muted">Chưa có lịch hẹn nào.</p>
      ) : (
        <Table hover responsive className="shadow-sm">
          <thead>
            <tr className="text-center">
              <th>Khách hàng</th>
              <th>Với</th>
              <th>Loại</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Hình thức</th>
              <th>Trạng thái</th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody className="align-middle text-center">
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.customer?.name || "N/A"}</td>
                <td>{a.expert?.name || "N/A"}</td>
                <td>{a.expertType}</td>
                <td>{a.date}</td>
                <td>{a.time}</td>
                <td>{a.mode === "online" ? "Online" : "Offline"}</td>
                <td>
                  <Badge
                    bg={
                      a.status === "confirmed"
                        ? "success"
                        : a.status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {a.status}
                  </Badge>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    value={a.status}
                    onChange={(e) => handleStatusChange(a._id, e.target.value)}
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="confirmed">Xác nhận</option>
                    <option value="rejected">Từ chối</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
