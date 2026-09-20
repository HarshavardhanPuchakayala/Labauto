import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiPlus, FiSearch, FiX } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import PatientForm from "../components/patients/patientForm";
import PatientTable from "../components/patients/PatientTable";
import Alert from "../components/ui/Alert";
import Button, { buttonClasses } from "../components/ui/Button";
import { Input } from "../components/ui/Form";
import PageHeader from "../components/ui/PageHeader";
import { TableSkeleton } from "../components/ui/Skeleton";
import StatStrip from "../components/ui/StatStrip";

function TechnicianDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <>
      <PageHeader
        title="Technician Dashboard"
        description="Manage patients"
        actions={
          <>
            <Link to="/reports" className={buttonClasses({ variant: "secondary" })}>
              <FiFileText className="h-4 w-4" aria-hidden="true" />
              Reports
            </Link>
            <Button icon={showForm ? FiX : FiPlus} onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Close form" : "New patient"}
            </Button>
          </>
        }
      />

      {showForm && (
        <PatientForm onPatientCreated={handlePatientCreated} onCancel={() => setShowForm(false)} />
      )}

      {!error && (
        <StatStrip
          className="mb-6"
          loading={loading}
          items={[
            { label: "Total patients", value: patients.length, tone: "teal" },
            {
              label: searchTerm ? "Matching your search" : "Showing",
              value: filteredPatients.length,
              tone: "sky",
            },
          ]}
        />
      )}

      <div className="mb-4 max-w-md">
        <Input
          icon={FiSearch}
          type="text"
          aria-label="Search patients by name or phone"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <TableSkeleton rows={6} columns={5} />}

      {error && <Alert className="mb-4">{error}</Alert>}

      {!loading && !error && (
        <PatientTable
          patients={filteredPatients}
          searchTerm={searchTerm}
          onAddPatient={() => setShowForm(true)}
        />
      )}
    </>
  );
}

export default TechnicianDashboard;
