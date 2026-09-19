import { useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

function CollectSampleButton({ reportId, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCollectSample = async () => {
    try {
      setLoading(true);
      setError("");

      await axiosInstance.patch(
        `/reports/${reportId}/collect-sample`
      );

      await onUpdated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to collect sample."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleCollectSample}
        disabled={loading}
        className="rounded-md bg-yellow-600 px-5 py-2 font-medium text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Collecting..." : "Collect Sample"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default CollectSampleButton;