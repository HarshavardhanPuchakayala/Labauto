import { Link } from "react-router-dom";

const statusColors = {
  pending: "bg-gray-200 text-gray-800",
  sample_collected: "bg-yellow-200 text-yellow-800",
  result_entered: "bg-blue-200 text-blue-800",
  completed: "bg-green-200 text-green-800",
};

function ReportTable({ reports }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Patient Name</th>
            <th className="px-4 py-3">Test Template</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Created Date</th>
          </tr>
        </thead>

        <tbody>
          {reports.map((report) => (
            <tr key={report._id} className="border-t">
              <td className="px-4 py-3">
                <Link
                  to={`/reports/${report._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {report.patient?.name || "Unknown"}
                </Link>
              </td>

              <td className="px-4 py-3">
                {report.testTemplate?.name || "Unknown"}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-1 text-xs ${
                    statusColors[report.status] ||
                    "bg-gray-200 text-gray-800"
                  }`}
                >
                  {report.status}
                </span>
              </td>

              <td className="px-4 py-3">
                {new Date(report.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No reports found.
        </p>
      )}
    </div>
  );
}

export default ReportTable;