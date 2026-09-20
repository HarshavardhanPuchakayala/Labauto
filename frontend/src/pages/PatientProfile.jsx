import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiCalendar,
  FiMail,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiShield,
  FiX,
} from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import InsuranceForm from "../components/Insurance/InsuranceForm";
import InsuranceList from "../components/Insurance/InsuranceList";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import { BackLink } from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";



const getAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age >= 0 ? age : null;
};

function InfoItem({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="mt-0.5 break-words text-sm font-medium text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

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

  if (loading) {
    return (
      <div className="space-y-6">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={3} />
      </div>
    );
  }
  if (error) {
    return (
      <>
        <BackLink to="/dashboard">Back to patients</BackLink>
        <Alert>{error}</Alert>
      </>
    );
  }
  if (!patient) return null;

  const age = getAge(patient.dob);

  return (
    <>
      <BackLink to="/dashboard">Back to patients</BackLink>

      <Card className="mb-6">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-100 text-2xl font-semibold text-teal-800"
          >
            {patient.name?.charAt(0)?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {patient.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                {patient.patientId}
              </span>
              <Badge>{patient.gender}</Badge>
              {age !== null && <Badge>{age} years</Badge>}
            </div>
          </div>
        </div>

        <dl className="grid gap-x-6 gap-y-5 border-t border-slate-100 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <InfoItem icon={FiCalendar} label="Date of birth">
            {new Date(patient.dob).toLocaleDateString()}
          </InfoItem>
          <InfoItem icon={FiPhone} label="Phone">
            {patient.phone || "—"}
          </InfoItem>
          <InfoItem icon={FiMail} label="Email">
            {patient.email || "—"}
          </InfoItem>
          <InfoItem icon={FiMapPin} label="Address">
            {patient.address || "—"}
          </InfoItem>
        </dl>
      </Card>

      <Card>
        <CardHeader
          icon={FiShield}
          title="Insurance policies"
          description={`${insurances.length} ${insurances.length === 1 ? "policy" : "policies"} on file`}
          action={
            <Button
              size="sm"
              variant={showForm ? "secondary" : "primary"}
              icon={showForm ? FiX : FiPlus}
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? "Cancel" : "Add insurance"}
            </Button>
          }
        />

        <CardBody>
          {showForm && <InsuranceForm patientId={id} onInsuranceAdded={handleInsuranceAdded} />}

          <InsuranceList
            insurances={insurances}
            onAdd={showForm ? undefined : () => setShowForm(true)}
          />
        </CardBody>
      </Card>
    </>
  );
}

export default PatientProfile;