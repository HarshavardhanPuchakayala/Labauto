import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import InsuranceForm from "../components/insurance/InsuranceForm";
import InsuranceList from "../components/insurance/InsuranceList";

function PatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [insurances, setInsurances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [patientRes, insuranceRes] = await Promise.all([
        axiosInstance.get(`/patients/${id}`),
        axiosInstance.get(`/insurance/${id}`),
      ]);
      setPatient(patientRes.data.patient);
      setInsurances(insuranceRes.data.insurances);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load patient profile.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInsuranceAdded = () => {
    setShowForm(false);
    fetchData();
  };

  if (loading) return <p className="py-10 text-center text-gray-600">Loading patient profile...</p>;
  if (error) return <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>;
  if (!patient) return null;

  return (
    <>
      <Link to="/dashboard" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Back to Patients
      </Link>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold">{patient.name}</h1>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><span className="font-medium">Patient ID:</span> {patient.patientId}</p>
          <p><span className="font-medium">DOB:</span> {new Date(patient.dob).toLocaleDateString()}</p>
          <p><span className="font-medium">Gender:</span> {patient.gender}</p>
          <p><span className="font-medium">Phone:</span> {patient.phone || "—"}</p>
          <p><span className="font-medium">Email:</span> {patient.email || "—"}</p>
          <p><span className="font-medium">Address:</span> {patient.address || "—"}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Insurance Policies</h2>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "Add Insurance"}
          </button>
        </div>

        {showForm && (
          <InsuranceForm patientId={id} onInsuranceAdded={handleInsuranceAdded} />
        )}

        <InsuranceList insurances={insurances} />
      </div>
    </>
  );
}

export default PatientProfile;