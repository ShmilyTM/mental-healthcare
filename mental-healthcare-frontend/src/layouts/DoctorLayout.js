import React from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import HeaderRole from "../components/HeaderRole";

export default function DoctorLayout({ children }) {
  return (
    <div className="d-flex">
      <SidebarDoctor />
      <div className="flex-grow-1">
        <HeaderRole title="Bảng điều khiển bác sĩ" />
        <div className="p-4 bg-light min-vh-100">{children}</div>
      </div>
    </div>
  );
}
