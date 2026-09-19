import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import PatientForm from "../components/patients/patientForm";
import PatientTable from "../components/patients/PatientTable";

function TechnicianDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get("/patients");
        setPatients(response.data.patients);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientCreated = (newPatient) => {
    setPatients((prev) => [...prev, newPatient]);
    setShowForm(false);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technician Dashboard</h1>
          <p className="text-gray-600">Manage patients</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "New Patient"}
        </button>
      </div>

      {showForm && (
        <PatientForm onPatientCreated={handlePatientCreated} onCancel={() => setShowForm(false)} />
      )}

      {loading && <p className="py-6 text-center text-gray-600">Loading patients...</p>}

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>
      )}

      {!loading && !error && <PatientTable patients={patients} />}
    </>
  );
}

export default TechnicianDashboard;