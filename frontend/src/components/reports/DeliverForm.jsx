import { useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

function DeliverForm({ reportId, onUpdated }) {
  const [deliveryMethod, setDeliveryMethod] =
    useState("digital");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axiosInstance.patch(
        `/reports/${reportId}/deliver`,
        {
          deliveryMethod,
        }
      );

      await onUpdated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to deliver report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Delivery Method
          </label>

          <select
            value={deliveryMethod}
            onChange={(e) =>
              setDeliveryMethod(e.target.value)
            }
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="digital">Digital</option>
            <option value="physical">Physical</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-purple-600 px-5 py-2 font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Delivering..." : "Deliver Report"}
        </button>
      </form>
    </div>
  );
}

export default DeliverForm;