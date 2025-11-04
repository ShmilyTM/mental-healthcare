import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Badge,
  Spinner,
  Pagination,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import api from "../api/axiosConfig";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = localStorage.getItem("token");

  // 🧾 Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        search,
        page,
        limit: 10,
        role: roleFilter,
      }).toString();

      const res = await api.get(`/users?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Lỗi tải danh sách người dùng:", err);
      alert("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPage(1);
      fetchUsers();
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(
        `/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      alert("Lỗi khi cập nhật vai trò");
    }
  };

  const toggleSuspend = async (id, current) => {
    try {
      await api.put(
        `/users/${id}/suspend`,
        { suspended: !current },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch {
      alert("Lỗi khi cập nhật trạng thái tài khoản");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) return;
    try {
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch {
      alert("Không thể xóa người dùng");
    }
  };

  // 📊 Xuất toàn bộ danh sách người dùng ra Excel
  const exportToExcel = async () => {
    try {
      const res = await api.get(`/users?limit=9999`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.users.map((u, i) => ({
        STT: i + 1,
        "Họ và tên": u.name,
        Email: u.email,
        "Vai trò": u.role,
        "Trạng thái": u.suspended ? "Đã khóa" : "Hoạt động",
        "Ngày tạo": new Date(u.createdAt).toLocaleDateString("vi-VN"),
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách người dùng");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `Danh_sach_Nguoi_dung_${new Date().toLocaleDateString("vi-VN")}.xlsx`);
    } catch (err) {
      console.error("❌ Lỗi khi xuất Excel:", err);
      alert("Không thể xuất file Excel");
    }
  };

  const renderPagination = () => (
    <Pagination className="justify-content-center mt-3">
      <Pagination.Prev
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
      />
      {[...Array(totalPages)].map((_, i) => (
        <Pagination.Item
          key={i}
          active={i + 1 === page}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
      />
    </Pagination>
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary mb-0">👑 Quản lý người dùng</h3>
        <Button variant="success" onClick={exportToExcel}>
          📊 Xuất Excel
        </Button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Row className="mb-4 justify-content-center">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
            <Button variant="primary" onClick={() => fetchUsers()}>
              🔍
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={roleFilter}
            onChange={(e) => {
              setPage(1);
              setRoleFilter(e.target.value);
            }}
          >
            <option value="">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="doctor">Chuyên gia</option>
            <option value="healer">Healer</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <div className="table-responsive shadow-sm rounded-3 p-3 bg-white">
            <Table striped hover bordered className="align-middle">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{(page - 1) * 10 + idx + 1}</td>
                    <td className="fw-semibold">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      >
                        <option value="customer">Khách hàng</option>
                        <option value="doctor">Chuyên gia</option>
                        <option value="healer">Healer</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </td>
                    <td>
                      {u.suspended ? (
                        <Badge bg="danger">Đã khóa</Badge>
                      ) : (
                        <Badge bg="success">Hoạt động</Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        variant={u.suspended ? "success" : "warning"}
                        size="sm"
                        className="me-2"
                        onClick={() => toggleSuspend(u._id, u.suspended)}
                      >
                        {u.suspended ? "Mở khóa" : "Khóa"}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(u._id)}
                      >
                        Xóa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
}
