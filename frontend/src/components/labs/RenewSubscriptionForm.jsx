import { useState } from "react";
import { FiCheck } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Form";

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
    <div className="max-w-xl rounded-lg border border-teal-200 bg-white p-4 text-left">
      {error && <Alert className="mb-3">{error}</Alert>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <Field label="New expiry date" className="sm:w-56">
          <Input
            type="date"
            value={newExpiryDate}
            onChange={(e) =>
              setNewExpiryDate(e.target.value)
            }
            required
          />
        </Field>

        <Button type="submit" icon={FiCheck} loading={loading}>
          {loading ? "Renewing..." : "Confirm renewal"}
        </Button>
      </form>
    </div>
  );
}

export default RenewSubscriptionForm;
