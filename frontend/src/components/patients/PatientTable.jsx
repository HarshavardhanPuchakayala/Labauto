import { Link } from "react-router-dom";

function PatientTable({ patients }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Patient ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">DOB</th>
            <th className="px-4 py-3">Gender</th>
            <th className="px-4 py-3">Phone</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient._id} className="border-t">
              <td className="px-4 py-3">{patient.patientId}</td>
              <td className="px-4 py-3">
                <Link to={`/patients/${patient._id}`} className="text-blue-600 hover:underline">
                  {patient.name}
                </Link>
              </td>
              <td className="px-4 py-3">{patient.dob}</td>
              <td className="px-4 py-3">{patient.gender}</td>
              <td className="px-4 py-3">{patient.phone || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {patients.length === 0 && (
        <p className="p-6 text-center text-gray-500">No patients found.</p>
      )}
    </div>
  );
}

export default PatientTable;