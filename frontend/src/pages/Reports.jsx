import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import ReportForm from "../components/reports/ReportForm";
import ReportTable from "../components/reports/ReportTable";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { TableSkeleton } from "../components/ui/Skeleton";
import StatStrip from "../components/ui/StatStrip";
import { REPORT_STATUS } from "../constants/theme";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "sample_collected", label: "Sample collected" },
  { value: "result_entered", label: "Result entered" },
  { value: "completed", label: "Completed" },
];

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = statusFilter === "all"
    ? reports
    : reports.filter((r) => r.status === statusFilter);

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

  const countByStatus = (status) =>
    status === "all" ? reports.length : reports.filter((r) => r.status === status).length;

  return (
    <>
      <PageHeader
        title="Reports"
        description="Create and manage patient reports"
        actions={
          <Button icon={showForm ? FiX : FiPlus} onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "New report"}
          </Button>
        }
      />

      {showForm && (
        <ReportForm onReportCreated={handleReportCreated} onCancel={() => setShowForm(false)} />
      )}

      {!error && (
        <StatStrip
          className="mb-6"
          loading={loading}
          items={[
            { label: "Total reports", value: reports.length, tone: "teal" },
            { label: "Pending", value: countByStatus("pending"), tone: "slate" },
            {
              label: "In progress",
              value: countByStatus("sample_collected") + countByStatus("result_entered"),
              tone: "amber",
              hint: "Sample collected or result entered",
            },
            { label: "Completed", value: countByStatus("completed"), tone: "emerald" },
          ]}
        />
      )}

      <div
        role="group"
        aria-label="Filter reports by status"
        className="mb-4 flex gap-2 overflow-x-auto pb-1"
      >
        {FILTERS.map((filter) => {
          const active = statusFilter === filter.value;
          return (
            <button
              key={filter.value}
              type="button"
              aria-pressed={active}
              onClick={() => setStatusFilter(filter.value)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                active
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {filter.value !== "all" && (
                <span
                  className={`h-2 w-2 rounded-full ${REPORT_STATUS[filter.value].dot}`}
                  aria-hidden="true"
                />
              )}
              {filter.label}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {countByStatus(filter.value)}
              </span>
            </button>
          );
        })}
      </div>

      {loading && <TableSkeleton rows={6} columns={5} />}

      {error && <Alert className="mb-4">{error}</Alert>}

      {!loading && !error && (
        <ReportTable
          reports={filteredReports}
          isFiltered={statusFilter !== "all"}
          onNewReport={() => setShowForm(true)}
        />
      )}
    </>
  );
}

export default Reports;
