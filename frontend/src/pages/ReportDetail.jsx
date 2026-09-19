import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import CollectSampleButton from "../components/reports/CollectSampleButton";
import EnterResultsForm from "../components/reports/EnterResultsForm";
import CompleteButton from "../components/reports/CompleteButton";
import DeliverForm from "../components/reports/DeliverForm";

const statusColors = {
  pending: "bg-gray-200 text-gray-800",
  sample_collected: "bg-yellow-200 text-yellow-800",
  result_entered: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
};

const formatStatus = (status) => {
  if (!status) return "";
  return status.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : null);

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(`/reports/${id}`);
      setReport(response.data.report);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  if (loading) {
    return <p className="py-10 text-center text-gray-600">Loading report...</p>;
  }

  if (error) {
    return (
      <>
        <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>
        <Link to="/reports" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Reports
        </Link>
      </>
    );
  }

  if (!report) return null;

  const isDelivered = Boolean(report.deliveredAt);

  return (
    <>
      <Link to="/reports" className="mb-4 inline-block text-blue-600 hover:underline">
        ← Back to Reports
      </Link>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Report Details</h1>
            <p className="mt-1 text-sm text-gray-500">Report ID: {report._id}</p>
          </div>
          <span className={`w-fit rounded px-3 py-1 text-sm font-medium ${statusColors[report.status] || "bg-gray-200 text-gray-800"}`}>
            {formatStatus(report.status)}
          </span>
        </div>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Patient Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {report.patient?.name || "Unknown"}</p>
            <p><span className="font-medium">Patient ID:</span> {report.patient?.patientId || "—"}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Test Information</h2>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Template:</span> {report.testTemplate?.name || "Unknown"}</p>
            <p><span className="font-medium">Technician:</span> {report.technician?.name || "Unknown"}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Report Timeline</h2>
        <div className="space-y-3 text-sm">
          {report.createdAt && <p><span className="font-medium">Created:</span> {formatDateTime(report.createdAt)}</p>}
          {report.sampleCollectedAt && <p><span className="font-medium">Sample Collected:</span> {formatDateTime(report.sampleCollectedAt)}</p>}
          {report.resultsEnteredAt && <p><span className="font-medium">Results Entered:</span> {formatDateTime(report.resultsEnteredAt)}</p>}
          {report.completedAt && <p><span className="font-medium">Completed:</span> {formatDateTime(report.completedAt)}</p>}
          {report.deliveredAt && <p><span className="font-medium">Delivered:</span> {formatDateTime(report.deliveredAt)}</p>}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Action</h2>

        {isDelivered ? (
          <div className="rounded-md bg-green-50 p-4 text-green-800">
            <p className="font-medium">Report Delivered</p>
            <p className="mt-1 text-sm">
              Delivered via <span className="font-medium">{report.deliveryMethod}</span> on {formatDateTime(report.deliveredAt)}
            </p>
          </div>
        ) : (
          <>
            {report.status === "pending" && <CollectSampleButton reportId={id} onUpdated={fetchReport} />}
            {report.status === "sample_collected" && <EnterResultsForm report={report} onUpdated={fetchReport} />}
            {report.status === "result_entered" && <CompleteButton reportId={id} onUpdated={fetchReport} />}
            {report.status === "completed" && <DeliverForm reportId={id} onUpdated={fetchReport} />}
          </>
        )}
      </div>
    </>
  );
}

export default ReportDetail;