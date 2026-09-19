function InsuranceList({ insurances }) {
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

  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Policy Number</th>
            <th className="px-4 py-3">Policy Holder</th>
            <th className="px-4 py-3">Expiry Date</th>
          </tr>
        </thead>

        <tbody>
          {insurances.map((insurance) => {
            const expired =
              insurance.expiryDate &&
              new Date(insurance.expiryDate) < new Date();

            return (
              <tr
                key={insurance._id}
                className="border-t"
              >
                <td className="px-4 py-3 font-medium">
                  {insurance.provider}
                </td>

                <td className="px-4 py-3">
                  {insurance.policyNumber}
                </td>

                <td className="px-4 py-3">
                  {insurance.policyHolderName}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>
                      {insurance.expiryDate
                        ? new Date(
                            insurance.expiryDate
                          ).toLocaleDateString()
                        : "—"}
                    </span>

                    {expired && (
                      <span className="rounded bg-red-200 px-2 py-1 text-xs font-medium text-red-800">
                        Expired
                      </span>
                    )}

                    {!expired &&
                      isExpiringSoon(
                        insurance.expiryDate
                      ) && (
                        <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800">
                          Expiring Soon
                        </span>
                      )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {insurances.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No insurance policies found.
        </p>
      )}
    </div>
  );
}

export default InsuranceList;