import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import ReportForm from "../components/reports/ReportForm";
import ReportTable from "../components/reports/ReportTable";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get("/reports");
        setReports(response.data.reports);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportCreated = (newReport) => {
    setReports((prev) => [newReport, ...prev]);
    setShowForm(false);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-600">Create and manage patient reports</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "New Report"}
        </button>
      </div>

      {showForm && (
        <ReportForm onReportCreated={handleReportCreated} onCancel={() => setShowForm(false)} />
      )}

      {loading && <p className="py-6 text-center text-gray-600">Loading reports...</p>}

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>
      )}

      {!loading && !error && <ReportTable reports={reports} />}
    </>
  );
}

export default Reports;