import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import LabSignup from "../pages/LabSignup";
import TechnicianDashboard from "../pages/TechnicianDashboard";
import OwnerDashboard from "../pages/OwnerDashboard";
import TestTemplates from "../pages/TestTemplates";
import Reports from "../pages/Reports";
import ReportDetail from "../pages/ReportDetail";
import PatientProfile from "../pages/PatientProfile";
import LabProfile from "../pages/LabProfile";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<LabSignup />} />

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
          path="/patients/:id"
          element={
            <ProtectedRoute requiredRole="technician">
              <PatientProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lab-profile"
          element={
            <ProtectedRoute requiredRole="technician">
              <LabProfile />
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;