import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/Login";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import OwnerDashboard from "../pages/OwnerDashboard";
import TestTemplates from "../pages/TestTemplates";
import Reports from "../pages/Reports";
import ReportDetail from "../pages/ReportDetail";
import PatientProfile from "../pages/PatientProfile";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="technician">
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-templates"
          element={
            <ProtectedRoute requiredRole="technician">
              <TestTemplates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredRole="technician">
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports/:id"
          element={
            <ProtectedRoute requiredRole="technician">
              <ReportDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner-dashboard"
          element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/patients/:id"
  element={
    <ProtectedRoute requiredRole="technician">
      <PatientProfile />
    </ProtectedRoute>
  }
/>
      </Route>


      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;