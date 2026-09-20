import { Link } from "react-router-dom";
import { FiChevronRight, FiFileText, FiFilter, FiPlus } from "react-icons/fi";

import { StatusBadge } from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { tableStyles } from "../../constants/theme";

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

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>Patient Name</th>
            <th className={tableStyles.th}>Test Template</th>
            <th className={tableStyles.th}>Status</th>
            <th className={tableStyles.th}>Created Date</th>
            <th className={tableStyles.th}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>

        <tbody className={tableStyles.tbody}>
          {reports.map((report) => (
            <tr key={report._id} className={`group ${tableStyles.row}`}>
              <td className={tableStyles.td}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800"
                  >
                    {report.patient?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                  <Link
                    to={`/reports/${report._id}`}
                    className="rounded font-medium text-slate-900 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    {report.patient?.name || "Unknown"}
                  </Link>
                </div>
              </td>

              <td className={tableStyles.td}>
                {report.testTemplate?.name || "Unknown"}
              </td>

              <td className={tableStyles.td}>
                {/* "delivered" is derived from deliveredAt when the list response includes it */}
                <StatusBadge status={report.deliveredAt ? "delivered" : report.status} />
              </td>

              <td className={`${tableStyles.td} tabular-nums`}>
                {new Date(report.createdAt).toLocaleDateString()}
              </td>

              <td className={`${tableStyles.td} w-10 text-right`}>
                <Link
                  to={`/reports/${report._id}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="inline-flex text-slate-300 transition-colors group-hover:text-teal-600"
                >
                  <FiChevronRight className="h-4 w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportTable;
