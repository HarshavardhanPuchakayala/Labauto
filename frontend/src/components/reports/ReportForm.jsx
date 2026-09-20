import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFilePlus } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
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
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError("");

        const [patientsResponse, templatesResponse] =
          await Promise.all([
            axiosInstance.get("/patients"),
            axiosInstance.get("/test-templates"),
          ]);

        setPatients(patientsResponse.data.patients);
        setTemplates(templatesResponse.data.templates);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load patients and test templates."
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!selectedPatient || !selectedTemplate) {
      setError("Please select a patient and test template.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/reports", {
        patient: selectedPatient,
        testTemplate: selectedTemplate,
      });

      const newReport = response.data.report;

      onReportCreated(newReport);

      setSelectedPatient("");
      setSelectedTemplate("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create report. Please try again."
      );
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
        description="Choose the patient and the test to run."
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
          <div className="grid gap-4 md:grid-cols-2">
            {/* Patient */}
            <Field label="Patient">
              <Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                required
              >
                <option value="">Select patient</option>

                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name} ({patient.patientId})
                  </option>
                ))}
              </Select>
            </Field>

            {/* Test Template */}
            <Field label="Test template">
              <Select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                required
              >
                <option value="">Select test template</option>

                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" icon={FiFilePlus} loading={loading}>
              {loading ? "Creating..." : "Create report"}
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
