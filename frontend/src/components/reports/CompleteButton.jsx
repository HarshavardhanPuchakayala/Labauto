import { useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

function CompleteButton({ reportId, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleComplete = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosInstance.patch(
        `/reports/${reportId}/complete`
      );

      await onUpdated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to complete report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleComplete}
        disabled={loading}
        className="rounded-md bg-green-600 px-5 py-2 font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Completing..." : "Mark Complete"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default CompleteButton;