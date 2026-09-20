import { Link } from "react-router-dom";
import { FiChevronRight, FiPlus, FiSearch, FiUsers } from "react-icons/fi";

import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { tableStyles } from "../../constants/theme";

// onAddPatient and searchTerm are optional, so existing usages keep working.
function PatientTable({ patients, onAddPatient, searchTerm }) {
  if (patients.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {searchTerm ? (
          <EmptyState
            icon={FiSearch}
            title="No patients match your search"
            description={`Nothing found for "${searchTerm}". Check the spelling or try a phone number.`}
          />
        ) : (
          <EmptyState
            icon={FiUsers}
            title="No patients yet"
            description="Add a patient to start creating reports and tracking insurance."
            action={
              onAddPatient && (
                <Button icon={FiPlus} onClick={onAddPatient}>
                  Add your first patient
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
            <th className={tableStyles.th}>Patient ID</th>
            <th className={tableStyles.th}>Name</th>
            <th className={tableStyles.th}>DOB</th>
            <th className={tableStyles.th}>Gender</th>
            <th className={tableStyles.th}>Phone</th>
            <th className={tableStyles.th}>
              <span className="sr-only">Open</span>
            </th>
          </tr>
        </thead>
        <tbody className={tableStyles.tbody}>
          {patients.map((patient) => (
            <tr key={patient._id} className={`group ${tableStyles.row}`}>
              <td className={tableStyles.td}>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                  {patient.patientId}
                </span>
              </td>
              <td className={tableStyles.td}>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800"
                  >
                    {patient.name?.charAt(0)?.toUpperCase()}
                  </span>
                  <Link
                    to={`/patients/${patient._id}`}
                    className="rounded font-medium text-slate-900 hover:text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                  >
                    {patient.name}
                  </Link>
                </div>
              </td>
              <td className={`${tableStyles.td} tabular-nums`}>{patient.dob}</td>
              <td className={tableStyles.td}>{patient.gender}</td>
              <td className={`${tableStyles.td} tabular-nums`}>{patient.phone || "—"}</td>
              <td className={`${tableStyles.td} w-10 text-right`}>
                <Link
                  to={`/patients/${patient._id}`}
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

export default PatientTable;
