import { useState } from "react";

import RenewSubscriptionForm from "./RenewSubscriptionForm";

const statusColors = {
  trial: "bg-blue-200 text-blue-800",
  active: "bg-green-200 text-green-800",
  expired: "bg-red-200 text-red-800",
};

function LabTable({ labs, onRenewed }) {
  const [renewingLabId, setRenewingLabId] =
    useState(null);

  const handleRenewed = async () => {
    setRenewingLabId(null);

    await onRenewed();
  };

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Lab ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">
              Subscription Status
            </th>
            <th className="px-4 py-3">Technicians</th>
            <th className="px-4 py-3">Expires On</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>

        <tbody>
          {labs.map((lab) => (
            <tr key={lab._id} className="border-t">
              <td className="px-4 py-3">
                {lab.labId || lab._id}
              </td>

              <td className="px-4 py-3 font-medium">
                {lab.name}
              </td>

              <td className="px-4 py-3">
                <span
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    statusColors[lab.subscriptionStatus] ||
                    "bg-gray-200 text-gray-800"
                  }`}
                >
                  {lab.subscriptionStatus}
                </span>
              </td>

              <td className="px-4 py-3">
                {lab.technicianCount ?? 0}
              </td>

              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span>
                    {lab.subscriptionExpiresAt
                      ? new Date(
                          lab.subscriptionExpiresAt
                        ).toLocaleDateString()
                      : "—"}
                  </span>

                  {lab.isExpiringSoon && (
                    <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800">
                      Expiring Soon
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() =>
                    setRenewingLabId((currentId) =>
                      currentId === lab._id
                        ? null
                        : lab._id
                    )
                  }
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {renewingLabId === lab._id
                    ? "Cancel"
                    : "Renew"}
                </button>

                {renewingLabId === lab._id && (
                  <RenewSubscriptionForm
                    labId={lab._id}
                    currentExpiryDate={
                      lab.subscriptionExpiresAt
                    }
                    onRenewed={handleRenewed}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {labs.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No labs found.
        </p>
      )}
    </div>
  );
}

export default LabTable;