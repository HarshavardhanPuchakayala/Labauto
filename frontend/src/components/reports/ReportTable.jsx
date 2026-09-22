import { Link } from "react-router-dom";
import { FiChevronRight, FiFileText, FiFilter, FiPlus } from "react-icons/fi";

import { StatusBadge } from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { tableStyles } from "../../constants/theme";

// Groups reports that share a visitId into a single row. Solo reports (no visitId)
// are treated as their own one-item group, unchanged from before.
function groupByVisit(reports) {
  const visits = new Map();
  const order = [];

  reports.forEach((report) => {
    const groupKey = report.visitId || report._id;
    if (!visits.has(groupKey)) {
      visits.set(groupKey, []);
      order.push(groupKey);
    }
    visits.get(groupKey).push(report);
  });

  return order.map((key) => ({
    key,
    reports: visits.get(key),
  }));
}

// A visit's overall status is the "earliest" stage among its reports —
// e.g. if one test is completed but another is still pending, the visit
// as a whole is still "pending" from the technician's point of view.
const STATUS_ORDER = ["pending", "sample_collected", "result_entered", "completed"];

function overallStatus(groupReports) {
  const allDelivered = groupReports.every((r) => r.deliveredAt);
  if (allDelivered) return "delivered";

  let earliestIndex = STATUS_ORDER.length - 1;
  groupReports.forEach((r) => {
    const idx = STATUS_ORDER.indexOf(r.status);
    if (idx < earliestIndex) earliestIndex = idx;
  });
  return STATUS_ORDER[earliestIndex];
}

// onNewReport and isFiltered are optional, so existing usages keep working.
function ReportTable({ reports, onNewReport, isFiltered }) {
  if (reports.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {isFiltered ? (
          <EmptyState
            icon={FiFilter}
            title="No reports with this status"
            description="Pick another status above, or choose All to see every report."
          />
        ) : (
          <EmptyState
            icon={FiFileText}
            title="No reports yet"
            description="Create a report to start tracking a sample from collection to delivery."
            action={
              onNewReport && (
                <Button icon={FiPlus} onClick={onNewReport}>
                  Create your first report
                </Button>
              )
            }
          />
        )}
      </div>
    );
  }

  const visitGroups = groupByVisit(reports);

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>Patient Name</th>
            <th className={tableStyles.th}>Tests</th>
            <th className={tableStyles.th}>Status</th>
            <th className={tableStyles.th}>Created Date</th>
            <th className={tableStyles.th}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>

        <tbody className={tableStyles.tbody}>
          {visitGroups.map((group) => {
            const first = group.reports[0];
            const isMulti = group.reports.length > 1;
            // For a multi-test visit, link to the first report — its detail page
            // shows the "part of a visit" banner with the combined-PDF download.
            const linkTo = `/reports/${first._id}`;

            return (
              <tr key={group.key} className={`group ${tableStyles.row}`}>
                <td className={tableStyles.td}>
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800"
                    >
                      {first.patient?.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                    <Link
                      to={linkTo}
                      className="rounded font-medium text-slate-900 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                    >
                      {first.patient?.name || "Unknown"}
                    </Link>
                  </div>
                </td>

                <td className={tableStyles.td}>
                  {isMulti ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                        {group.reports.length} tests
                      </span>
                      <span className="max-w-xs truncate text-sm text-slate-600">
                        {group.reports.map((r) => r.testTemplate?.name || "Unknown").join(", ")}
                      </span>
                    </div>
                  ) : (
                    first.testTemplate?.name || "Unknown"
                  )}
                </td>

                <td className={tableStyles.td}>
                  <StatusBadge status={overallStatus(group.reports)} />
                </td>

                <td className={`${tableStyles.td} tabular-nums`}>
                  {new Date(first.createdAt).toLocaleDateString()}
                </td>

                <td className={`${tableStyles.td} w-10 text-right`}>
                  <Link
                    to={linkTo}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="inline-flex text-slate-300 transition-colors group-hover:text-teal-600"
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;