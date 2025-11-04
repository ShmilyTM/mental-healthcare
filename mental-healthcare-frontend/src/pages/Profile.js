import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card, Table, Badge } from "react-bootstrap";
import api from "../api/axiosConfig";

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // 🔹 Lấy thông tin user
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      setName(stored.name);
      setPhone(stored.phone || "");
      setAvatar(stored.avatar || "");
    }
  }, []);

  // 🔹 Lấy danh sách lịch hẹn
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/appointments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error("Lỗi khi tải lịch hẹn:", err);
      }
    };
    fetchAppointments();
  }, []);

  // 🔹 Cập nhật hồ sơ
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (file) formData.append("avatar", file);

      const res = await api.put("/auth/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Cập nhật hồ sơ thành công!");
      setAvatar(res.data.user.avatar);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi cập nhật hồ sơ");
    }
  };

  // 🔹 Hủy lịch hẹn
  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments((prev) => prev.filter((a) => a._id !== id));
      alert("Đã hủy lịch hẹn.");
    } catch (err) {
      alert("Lỗi khi hủy lịch hẹn.");
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* ----------- HỒ SƠ CÁ NHÂN ----------- */}
        <Col md={5}>
          <Card className="p-4 shadow-sm mb-4">
            <h4 className="text-center mb-4 fw-bold text-primary">Thông tin cá nhân</h4>
            <div className="text-center mb-3">
              <img
                src={avatar || "https://cdn-icons-png.flaticon.com/512/4140/4140037.png"}
                alt="avatar"
                className="rounded-circle mb-2"
                width={250}
                height={250}
              />
            </div>

            <Form onSubmit={handleUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện</Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100">
                Cập nhật hồ sơ
              </Button>
            </Form>
          </Card>
        </Col>

        {/* ----------- DANH SÁCH LỊCH HẸN ----------- */}
        <Col md={7}>
          <Card className="p-4 shadow-sm">
            <h4 className="fw-bold text-success mb-4 text-center">📅 Lịch hẹn đã đặt</h4>

            {appointments.length === 0 ? (
              <p className="text-center text-muted">Bạn chưa có lịch hẹn nào.</p>
            ) : (
              <Table hover responsive>
                <thead>
                  <tr className="text-center">
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Với</th>
                    <th>Loại</th>
                    <th>Hình thức</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="align-middle text-center">
                  {appointments.map((a) => (
                    <tr key={a._id}>
                      <td>{a.date}</td>
                      <td>{a.time}</td>
                      <td>{a.expert?.name || "N/A"}</td>
                      <td>{a.expertType}</td>
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
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancel(a._id)}
                        >
                          Hủy
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
