import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FiActivity,
  FiCheckCircle,
  FiClipboard,
  FiDownload,
  FiDroplet,
  FiEdit3,
  FiFilePlus,
  FiFileText,
  FiHash,
  FiSend,
  FiUser,
  FiUserCheck,
} from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import CollectSampleButton from "../components/reports/CollectSampleButton";
import EnterResultsForm from "../components/reports/EnterResultsForm";
import CompleteButton from "../components/reports/CompleteButton";
import DeliverForm from "../components/reports/DeliverForm";
import Alert from "../components/ui/Alert";
import { StatusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import { BackLink } from "../components/ui/PageHeader";
import Skeleton, { CardSkeleton } from "../components/ui/Skeleton";
import { REPORT_STATUS } from "../constants/theme";

const formatDateTime = (date) => (date ? new Date(date).toLocaleString() : null);

const TIMELINE_STEPS = [
  { key: "pending", label: "Created", field: "createdAt", icon: FiFilePlus },
  { key: "sample_collected", label: "Sample collected", field: "sampleCollectedAt", icon: FiDroplet },
  { key: "result_entered", label: "Results entered", field: "resultsEnteredAt", icon: FiEdit3 },
  { key: "completed", label: "Completed", field: "completedAt", icon: FiCheckCircle },
  { key: "delivered", label: "Delivered", field: "deliveredAt", icon: FiSend },
];

const ACTION_COPY = {
  pending: {
    icon: FiDroplet,
    title: "Collect the sample",
    description: "Confirm the sample has been collected to move this report forward.",
  },
  sample_collected: {
    icon: FiEdit3,
    title: "Enter test results",
    description: "Fill in each measured value. Normal ranges are shown beneath the fields.",
  },
  result_entered: {
    icon: FiCheckCircle,
    title: "Review and complete",
    description: "Once the results look right, mark the report as complete.",
  },
  completed: {
    icon: FiSend,
    title: "Deliver the report",
    description: "Choose how this report reaches the patient.",
  },
  delivered: {
    icon: FiSend,
    title: "Report delivered",
    description: "This report has reached the patient.",
  },
};

function InfoRow({ icon: Icon, label, children }) {
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

function Timeline({ report }) {
  const currentIndex = TIMELINE_STEPS.findIndex((step) => !report[step.field]);

  return (
    <ol>
      {TIMELINE_STEPS.map((step, index) => {
        const timestamp = report[step.field];
        const done = Boolean(timestamp);
        const current = index === currentIndex;
        const nextDone = index < TIMELINE_STEPS.length - 1 && Boolean(report[TIMELINE_STEPS[index + 1].field]);
        const isLast = index === TIMELINE_STEPS.length - 1;
        const Icon = step.icon;

        return (
          <li key={step.key} className="relative flex gap-3.5 pb-6 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-4 top-8 w-0.5 -translate-x-1/2 ${
                  nextDone ? "bg-teal-500" : "bg-slate-200"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                done
                  ? "bg-teal-600 text-white"
                  : current
                    ? "border-2 border-teal-500 bg-white text-teal-600"
                    : "border border-slate-200 bg-slate-50 text-slate-400"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p
                className={`text-sm font-medium ${
                  done || current ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs tabular-nums text-slate-500">
                {done ? formatDateTime(timestamp) : current ? "Up next" : "Waiting"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(`/reports/${id}`);
      setReport(response.data.report);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true);
      setDownloadError("");

      const response = await axiosInstance.get(`/reports/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      let message = "Failed to download PDF.";
      // With responseType "blob", error bodies are Blobs too, so decode them
      if (err.response?.data instanceof Blob) {
        try {
          const parsed = JSON.parse(await err.response.data.text());
          message = parsed.message || message;
        } catch {
          // keep default message
        }
      }
      setDownloadError(message);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div role="status">
        <span className="sr-only">Loading report…</span>
        <Skeleton className="mb-5 h-4 w-32" />
        <CardSkeleton lines={2} className="mb-6" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CardSkeleton lines={4} />
            <CardSkeleton lines={3} />
          </div>
          <CardSkeleton lines={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <BackLink to="/reports">Back to reports</BackLink>
        <Alert>{error}</Alert>
      </>
    );
  }

  if (!report) return null;

  const isDelivered = Boolean(report.deliveredAt);
  // "delivered" is derived from deliveredAt; the stored status stays "completed".
  const displayStatus = isDelivered ? "delivered" : report.status;
  const action = ACTION_COPY[displayStatus];

  return (
    <>
      <BackLink to="/reports">Back to reports</BackLink>

      <Card className="mb-6 overflow-hidden">
        <div className="flex gap-1" aria-hidden="true">
          {TIMELINE_STEPS.map((step) => (
            <span
              key={step.key}
              className={`h-1 flex-1 ${report[step.field] ? "bg-teal-500" : "bg-slate-200"}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
                REPORT_STATUS[displayStatus]?.tile || "bg-slate-100 text-slate-600"
              }`}
            >
              <FiFileText className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Report details
              </h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <FiHash className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Report ID:</span>
                <span className="break-all font-mono text-xs">{report._id}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={displayStatus} size="lg" />
            {report.status === "completed" && (
              <Button
                variant="dark"
                icon={FiDownload}
                onClick={handleDownloadPdf}
                loading={downloading}
              >
                {downloading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {downloadError && <Alert className="mb-6">{downloadError}</Alert>}

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader icon={FiUser} title="Patient information" />
              <CardBody>
                <dl className="space-y-4">
                  <InfoRow icon={FiUser} label="Name">
                    {report.patient?.name || "Unknown"}
                  </InfoRow>
                  <InfoRow icon={FiHash} label="Patient ID">
                    {report.patient?.patientId || "—"}
                  </InfoRow>
                </dl>
              </CardBody>
            </Card>

            <Card>
              <CardHeader icon={FiClipboard} title="Test information" />
              <CardBody>
                <dl className="space-y-4">
                  <InfoRow icon={FiClipboard} label="Template">
                    {report.testTemplate?.name || "Unknown"}
                  </InfoRow>
                  <InfoRow icon={FiUserCheck} label="Technician">
                    {report.technician?.name || "Unknown"}
                  </InfoRow>
                </dl>
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader
              icon={action?.icon || FiActivity}
              iconClass={REPORT_STATUS[displayStatus]?.tile || "bg-slate-100 text-slate-600"}
              title={action?.title || "Action"}
              description={action?.description}
            />

            <CardBody>
              {isDelivered ? (
                <div className="flex items-start gap-4 rounded-lg border border-teal-200 bg-teal-50 p-5 text-teal-900">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white">
                    <FiSend className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-semibold">Report delivered</p>
                    <p className="mt-1 text-sm text-teal-800">
                      Delivered via <span className="font-semibold">{report.deliveryMethod}</span> on{" "}
                      {formatDateTime(report.deliveredAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {report.status === "pending" && (
                    <CollectSampleButton reportId={id} onUpdated={fetchReport} />
                  )}
                  {report.status === "sample_collected" && (
                    <EnterResultsForm report={report} onUpdated={fetchReport} />
                  )}
                  {report.status === "result_entered" && (
                    <CompleteButton reportId={id} onUpdated={fetchReport} />
                  )}
                  {report.status === "completed" && (
                    <DeliverForm reportId={id} onUpdated={fetchReport} />
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </div>

        <Card className="lg:sticky lg:top-6">
          <CardHeader icon={FiActivity} title="Report timeline" />
          <CardBody>
            <Timeline report={report} />
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default ReportDetail;
