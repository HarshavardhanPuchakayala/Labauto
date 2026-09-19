import { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

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
      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <p className="text-gray-600">
          Loading patients and test templates...
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Create Report
        </h2>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Patient
          </label>

          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select patient</option>

            {patients.map((patient) => (
              <option key={patient._id} value={patient._id}>
                {patient.name} ({patient.patientId})
              </option>
            ))}
          </select>
        </div>

        {/* Test Template */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Test Template
          </label>

          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            required
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="">Select test template</option>

            {templates.map((template) => (
              <option key={template._id} value={template._id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;