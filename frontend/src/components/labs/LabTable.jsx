import { Fragment, useState } from "react";
import { FiAlertTriangle, FiBriefcase, FiPlus, FiRefreshCw, FiUsers, FiX } from "react-icons/fi";

import RenewSubscriptionForm from "./RenewSubscriptionForm";
import Badge, { SubscriptionBadge } from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import { tableStyles } from "../../constants/theme";

// onAddLab is optional, so existing usages keep working.
function LabTable({ labs, onRenewed, onAddLab }) {
  const [renewingLabId, setRenewingLabId] =
    useState(null);

  const handleRenewed = async () => {
    setRenewingLabId(null);

    await onRenewed();
  };

  if (labs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <EmptyState
          icon={FiBriefcase}
          title="No labs yet"
          description="Create a lab to give a diagnostic centre access to LabAuto and start its subscription."
          action={
            onAddLab && (
              <Button icon={FiPlus} onClick={onAddLab}>
                Create the first lab
              </Button>
            )
          }
        />
      </div>
    );
  }

  return (
    <div className={tableStyles.wrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <th className={tableStyles.th}>Lab</th>
            <th className={tableStyles.th}>Subscription status</th>
            <th className={tableStyles.th}>Technicians</th>
            <th className={tableStyles.th}>Expires on</th>
            <th className={`${tableStyles.th} text-right`}>Action</th>
          </tr>
        </thead>

        <tbody className={tableStyles.tbody}>
          {labs.map((lab) => {
            const renewing = renewingLabId === lab._id;

            return (
              <Fragment key={lab._id}>
                <tr className={tableStyles.row}>
                  <td className={tableStyles.td}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-600"
                      >
                        {lab.name?.charAt(0)?.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-900">{lab.name}</p>
                        <p className="font-mono text-xs text-slate-500">{lab.labId || lab._id}</p>
                      </div>
                    </div>
                  </td>

                  <td className={tableStyles.td}>
                    <SubscriptionBadge status={lab.subscriptionStatus} />
                  </td>

                  <td className={tableStyles.td}>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <FiUsers className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      {lab.technicianCount ?? 0}
                    </span>
                  </td>

                  <td className={tableStyles.td}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="tabular-nums">
                        {lab.subscriptionExpiresAt
                          ? new Date(
                              lab.subscriptionExpiresAt
                            ).toLocaleDateString()
                          : "—"}
                      </span>

                      {lab.isExpiringSoon && (
                        <Badge tone="warning" icon={FiAlertTriangle}>
                          Expiring soon
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className={`${tableStyles.td} text-right`}>
                    <Button
                      size="sm"
                      variant={renewing ? "ghost" : "secondary"}
                      icon={renewing ? FiX : FiRefreshCw}
                      aria-expanded={renewing}
                      onClick={() =>
                        setRenewingLabId((currentId) =>
                          currentId === lab._id
                            ? null
                            : lab._id
                        )
                      }
                    >
                      {renewing ? "Cancel" : "Renew"}
                    </Button>
                  </td>
                </tr>

                {renewing && (
                  <tr>
                    <td
                      colSpan={5}
                      className="border-b border-slate-100 bg-slate-50/70 px-4 py-4"
                    >
                      <RenewSubscriptionForm
                        labId={lab._id}
                        currentExpiryDate={
                          lab.subscriptionExpiresAt
                        }
                        onRenewed={handleRenewed}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default LabTable;
