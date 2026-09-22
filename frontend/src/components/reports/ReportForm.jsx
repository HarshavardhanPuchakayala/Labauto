import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiFilePlus } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card, { CardBody, CardHeader } from "../ui/Card";
import { Field, Select } from "../ui/Form";
import Skeleton from "../ui/Skeleton";

const inlineLink =
  "font-medium underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600";

function ReportForm({ onReportCreated, onCancel }) {
  const [patients, setPatients] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [patientsResponse, templatesResponse] = await Promise.all([
          axiosInstance.get("/patients"),
          axiosInstance.get("/test-templates"),
        ]);

        setPatients(patientsResponse.data.patients);
        setTemplates(templatesResponse.data.templates);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load patients and test templates.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const toggleTemplate = (templateId) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedPatient) {
      setError("Please select a patient.");
      return;
    }
    if (selectedTemplates.length === 0) {
      setError("Please select at least one test.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/reports/batch", {
        patient: selectedPatient,
        testTemplates: selectedTemplates,
      });

      onReportCreated(response.data.reports);

      setSelectedPatient("");
      setSelectedTemplates([]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Card className="mb-6" role="status">
        <CardBody>
          <span className="sr-only">Loading patients and test templates...</span>
          <Skeleton className="mb-6 h-5 w-40" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader
        icon={FiFilePlus}
        title="Create report"
        description="Choose the patient and one or more tests to run in this visit."
      />

      <CardBody>
        {error && <Alert className="mb-5">{error}</Alert>}

        {patients.length === 0 && (
          <Alert tone="info" className="mb-5">
            You have no patients yet.{" "}
            <Link to="/dashboard" className={inlineLink}>
              Add a patient
            </Link>{" "}
            first.
          </Alert>
        )}

        {templates.length === 0 && (
          <Alert tone="info" className="mb-5">
            You have no test templates yet.{" "}
            <Link to="/test-templates" className={inlineLink}>
              Create a template
            </Link>{" "}
            first.
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Patient" className="max-w-md">
            <Select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} required>
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.name} ({patient.patientId})
                </option>
              ))}
            </Select>
          </Field>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Tests for this visit</span>
              {selectedTemplates.length > 0 && <Badge tone="success">{selectedTemplates.length} selected</Badge>}
            </div>

            <div className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
              {templates.map((template) => {
                const checked = selectedTemplates.includes(template._id);
                return (
                  <label
                    key={template._id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors duration-150 ${
                      checked
                        ? "border-teal-500 bg-teal-50 text-teal-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        checked ? "border-teal-600 bg-teal-600 text-white" : "border-slate-300 bg-white"
                      }`}
                    >
                      {checked && <FiCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => toggleTemplate(template._id)}
                    />
                    <span className="min-w-0 truncate font-medium">{template.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" icon={FiFilePlus} loading={loading}>
              {loading
                ? "Creating..."
                : selectedTemplates.length > 1
                  ? `Create ${selectedTemplates.length} reports`
                  : "Create report"}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default ReportForm;