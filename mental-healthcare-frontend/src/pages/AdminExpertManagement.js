import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function AdminExpertManagement() {
  const [doctors, setDoctors] = useState([]);
  const [healers, setHealers] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    description: "",
    avatar: null,
    type: "doctor",
  });

  // 📦 Lấy dữ liệu ban đầu
  const fetchData = async () => {
    const [dRes, hRes] = await Promise.all([
      api.get("/experts/doctors"),
      api.get("/experts/healers"),
    ]);
    setDoctors(dRes.data);
    setHealers(hRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🎯 Xử lý form
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setForm({ ...form, avatar: files[0] });
    else setForm({ ...form, [name]: value });
    
  };

  // 💾 Gửi form (thêm / cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key]) formData.append(key, form[key]);
    }

    if (editId) {
      await api.put(`/experts/${form.type}s/${editId}`, formData);
    } else {
      await api.post(`/experts/${form.type}s`, formData);
    }

    setForm({
      name: "",
      specialization: "",
      description: "",
      avatar: null,
      type: "doctor",
    });
    setEditId(null);
    fetchData();
  };

  // ✏️ Chọn chuyên gia để sửa
  const handleEdit = (expert, type) => {
    setForm({
      name: expert.name,
      specialization: expert.specialization,
      description: expert.description || "",
      avatar: null,
      type,
    });
    setEditId(expert._id);
  };

  // ❌ Xóa chuyên gia
  const handleDelete = async (type, id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa chuyên gia này?")) return;
    await api.delete(`/experts/${type}s/${id}`);
    fetchData();
  };

  // 🔄 Hủy chỉnh sửa
  const handleCancel = () => {
    setEditId(null);
    setForm({
      name: "",
      specialization: "",
      description: "",
      avatar: null,
      type: "doctor",
    });
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">👨‍⚕️ Quản lý Bác sĩ & Healer</h3>

      {/* 🧾 Form Thêm / Sửa */}
      <form className="card p-3 mb-4 shadow-sm" onSubmit={handleSubmit}>
        <h5 className="fw-semibold mb-3">
          {editId ? "📝 Chỉnh sửa chuyên gia" : "➕ Thêm chuyên gia mới"}
        </h5>

        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              name="name"
              placeholder="Họ tên"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="text"
              name="specialization"
              placeholder="Chuyên môn"
              className="form-control"
              value={form.specialization}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-3">
            <input
              type="file"
              name="avatar"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="doctor">Bác sĩ</option>
              <option value="healer">Healer</option>
            </select>
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Mô tả ngắn (chuyên môn, kinh nghiệm...)"
          className="form-control mt-2"
          rows="2"
          value={form.description}
          onChange={handleChange}
        />

        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit">
            {editId ? "💾 Lưu thay đổi" : "➕ Thêm mới"}
          </button>
          {editId && (
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* 📋 Danh sách chuyên gia */}
      <div className="row">
        <div className="col-md-6">
          <h5 className="fw-bold mb-2">👩‍⚕️ Danh sách Bác sĩ</h5>
          <ul className="list-group shadow-sm">
            {doctors.map((d) => (
              <li
                key={d._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-2">
                  {d.avatar && (
                    <img
                      src={`http://localhost:5000${d.avatar}`}
                      alt="doctor"
                      width="45"
                      height="45"
                      className="rounded-circle"
                    />
                  )}
                  <div>
                    <strong>{d.name}</strong> <br />
                    <small>{d.specialization}</small>
                  </div>
                </div>

                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(d, "doctor")}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete("doctor", d._id)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h5 className="fw-bold mb-2">🧘 Danh sách Healer</h5>
          <ul className="list-group shadow-sm">
            {healers.map((h) => (
              <li
                key={h._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-2">
                  {h.avatar && (
                    <img
                      src={`http://localhost:5000${h.avatar}`}
                      alt="healer"
                      width="45"
                      height="45"
                      className="rounded-circle"
                    />
                  )}
                  <div>
                    <strong>{h.name}</strong> <br />
                    <small>{h.specialization}</small>
                  </div>
                </div>

                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEdit(h, "healer")}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete("healer", h._id)}
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
