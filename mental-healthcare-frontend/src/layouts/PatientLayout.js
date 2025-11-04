import React from "react";
import SidebarPatient from "../components/SidebarPatient";
import HeaderRole from "../components/HeaderRole";

export default function PatientLayout({ children }) {
  return (
    <div className="d-flex">
      <SidebarPatient />
      <div className="flex-grow-1">
        <HeaderRole title="Bảng điều khiển bệnh nhân" />
        <div className="p-4 bg-light min-vh-100">{children}</div>
      </div>
    </div>
  );
}
