import { FiAlertTriangle, FiCheckCircle, FiPlus, FiShield, FiXCircle } from "react-icons/fi";

import Badge from "../ui/Badge";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";

// onAdd is optional, so existing usages keep working.
function InsuranceList({ insurances, onAdd }) {
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;

    const today = new Date();
    const expiry = new Date(expiryDate);

    const differenceInMs =
      expiry.getTime() - today.getTime();

    const differenceInDays =
      differenceInMs / (1000 * 60 * 60 * 24);

    return differenceInDays >= 0 && differenceInDays <= 7;
  };

  if (insurances.length === 0) {
    return (
      <EmptyState
        icon={FiShield}
        title="No insurance policies yet"
        description="Add a policy to keep provider and expiry details next to the patient's record."
        action={
          onAdd && (
            <Button icon={FiPlus} onClick={onAdd}>
              Add insurance
            </Button>
          )
        }
      />
    );
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {insurances.map((insurance) => {
        const expired =
          insurance.expiryDate &&
          new Date(insurance.expiryDate) < new Date();
        const expiringSoon = !expired && isExpiringSoon(insurance.expiryDate);

        const accent = expired
          ? "border-l-rose-400"
          : expiringSoon
            ? "border-l-amber-400"
            : insurance.expiryDate
              ? "border-l-emerald-400"
              : "border-l-slate-300";

        return (
          <li
            key={insurance._id}
            className={`rounded-lg border border-l-4 border-slate-200 bg-white p-4 ${accent}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <FiShield className="h-4 w-4" aria-hidden="true" />
                </span>
                <p className="truncate font-semibold text-slate-900">{insurance.provider}</p>
              </div>

              {expired && (
                <Badge tone="danger" icon={FiXCircle}>
                  Expired
                </Badge>
              )}
              {expiringSoon && (
                <Badge tone="warning" icon={FiAlertTriangle}>
                  Expiring soon
                </Badge>
              )}
              {!expired && !expiringSoon && insurance.expiryDate && (
                <Badge tone="success" icon={FiCheckCircle}>
                  Valid
                </Badge>
              )}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Policy number</dt>
                <dd className="mt-0.5 font-mono text-slate-900">{insurance.policyNumber}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Expiry date</dt>
                <dd className="mt-0.5 tabular-nums text-slate-900">
                  {insurance.expiryDate
                    ? new Date(
                        insurance.expiryDate
                      ).toLocaleDateString()
                    : "—"}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-slate-500">Policy holder</dt>
                <dd className="mt-0.5 text-slate-900">{insurance.policyHolderName}</dd>
              </div>
            </dl>
          </li>
        );
      })}
    </ul>
  );
}

export default InsuranceList;
