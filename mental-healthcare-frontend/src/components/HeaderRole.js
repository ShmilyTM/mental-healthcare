import React from "react";

export default function HeaderRole({ title }) {
  return (
    <div className="border-bottom bg-white p-3 shadow-sm d-flex justify-content-between align-items-center">
      <h5 className="m-0 fw-bold text-primary">{title}</h5>
      <small className="text-muted">{new Date().toLocaleDateString("vi-VN")}</small>
    </div>
  );
}
