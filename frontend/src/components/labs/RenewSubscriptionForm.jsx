import { useState } from "react";

import axiosInstance from "../../api/axiosInstance";

function RenewSubscriptionForm({
  labId,
  currentExpiryDate,
  onRenewed,
}) {
  const [newExpiryDate, setNewExpiryDate] = useState(
    currentExpiryDate
      ? new Date(currentExpiryDate)
          .toISOString()
          .split("T")[0]
      : ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!newExpiryDate) {
      setError("Please select a new expiry date.");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.patch(
        `/labs/${labId}/renew`,
        {
          subscriptionExpiresAt: newExpiryDate,
        }
      );

      await onRenewed();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to renew subscription. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 rounded-md border bg-gray-50 p-4">
      {error && (
        <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">
            New Expiry Date
          </label>

          <input
            type="date"
            value={newExpiryDate}
            onChange={(e) =>
              setNewExpiryDate(e.target.value)
            }
            required
            className="rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Renewing..." : "Confirm Renewal"}
        </button>
      </form>
    </div>
  );
}

export default RenewSubscriptionForm;