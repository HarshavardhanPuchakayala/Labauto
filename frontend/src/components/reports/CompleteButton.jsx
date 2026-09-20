import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";

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
      <Button
        variant="success"
        size="lg"
        icon={FiCheckCircle}
        onClick={handleComplete}
        loading={loading}
      >
        {loading ? "Completing..." : "Mark complete"}
      </Button>

      {error && <Alert className="mt-4">{error}</Alert>}
    </div>
  );
}

export default CompleteButton;
