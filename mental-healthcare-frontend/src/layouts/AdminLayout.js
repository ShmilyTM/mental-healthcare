import React from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import HeaderRole from "../components/HeaderRole";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <SidebarAdmin />
      <div className="flex-grow-1">
        <HeaderRole title="Trang quản trị hệ thống" />
        <div className="p-4 bg-light min-vh-100">{children}</div>
      </div>
    </div>
  );
}
