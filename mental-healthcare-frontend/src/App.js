import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 🧩 Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorList from "./pages/DoctorList";
import HealerList from "./pages/HealerList";
import Meditation from "./pages/Meditation";
import Journal from "./pages/Journal";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Payment from "./pages/Payment";
import HealerDetails from "./pages/HealerDetails";
import DoctorDetails from "./pages/DoctorDetails";
import Booking from "./pages/Booking";
import AdminAppointments from "./pages/AdminAppointments";
import UserManagement from "./pages/UserManagement";
import Chatbot from "./pages/Chatbot";
import DoctorChat from "./pages/DoctorChat";
import PatientChat from "./pages/PatientChat";
import DoctorDashboard from "./pages/DoctorDashboard";
import HealerDashboard from "./pages/HealerDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminExpertManagement from "./pages/AdminExpertManagement";

// 🧱 Layouts
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/healers" element={<HealerList />} />
        <Route path="/meditations" element={<Meditation />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/healers/:id" element={<HealerDetails />} />
        <Route path="/booking/:id" element={<Booking />} />
        <Route path="/chatbot" element={<Chatbot />} />

        {/* 🧘‍♀️ Healer Dashboard */}
        <Route
          path="/healer/dashboard"
          element={
            <ProtectedRoute role="healer">
              <HealerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/experts"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminExpertManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <AdminAppointments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout>
                <UserManagement />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Doctor routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute role="doctor">
              <DoctorLayout>
                <DoctorDashboard />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/chat"
          element={
            <ProtectedRoute role="doctor">
              <DoctorLayout>
                <DoctorChat />
              </DoctorLayout>
            </ProtectedRoute>
          }
        />

        {/* Patient routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute role="customer">
              <PatientLayout>
                <PatientDashboard />
              </PatientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/chat"
          element={
            <ProtectedRoute role="customer">
              <PatientLayout>
                <PatientChat />
              </PatientLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
