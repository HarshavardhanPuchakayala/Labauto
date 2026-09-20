import { useState } from "react";
import { FiDroplet } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";

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
      <Button size="lg" icon={FiDroplet} onClick={handleCollectSample} loading={loading}>
        {loading ? "Collecting..." : "Collect sample"}
      </Button>

      {error && <Alert className="mt-4">{error}</Alert>}
    </div>
  );
}

export default CollectSampleButton;
