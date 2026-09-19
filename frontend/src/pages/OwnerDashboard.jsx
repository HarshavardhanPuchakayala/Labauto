import { useCallback, useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import LabForm from "../components/labs/LabForm";
import LabTable from "../components/labs/LabTable";

function OwnerDashboard() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchLabs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/admin/labs");
      setLabs(response.data.labs);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load labs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleLabCreated = async () => {
    setShowForm(false);
    await fetchLabs();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Owner Dashboard</h1>
          <p className="text-gray-600">Manage labs and subscriptions</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "New Lab"}
        </button>
      </div>

      {showForm && (
        <LabForm onLabCreated={handleLabCreated} onCancel={() => setShowForm(false)} />
      )}

      {loading && <p className="py-6 text-center text-gray-600">Loading labs...</p>}

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>
      )}

      {!loading && !error && <LabTable labs={labs} />}
    </>
  );
}

export default OwnerDashboard;