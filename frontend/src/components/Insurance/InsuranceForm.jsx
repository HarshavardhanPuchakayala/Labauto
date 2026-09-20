import { useState } from "react";
import { FiSave } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Form";

function InsuranceForm({ patientId, onInsuranceAdded }) {
  const [formData, setFormData] = useState({
    provider: "",
    policyNumber: "",
    policyHolderName: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/insurance", { ...formData, patient: patientId });
      onInsuranceAdded();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add insurance.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50/40 p-4 sm:p-5">
      {error && <Alert className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <Field label="Provider">
          <Input
            name="provider"
            value={formData.provider}
            onChange={handleChange}
            required
            placeholder="Provider (e.g. Star Health)"
          />
        </Field>
        <Field label="Policy number">
          <Input
            name="policyNumber"
            value={formData.policyNumber}
            onChange={handleChange}
            required
            placeholder="Policy Number"
          />
        </Field>
        <Field label="Policy holder name">
          <Input
            name="policyHolderName"
            value={formData.policyHolderName}
            onChange={handleChange}
            required
            placeholder="Policy Holder Name"
          />
        </Field>
        <Field label="Expiry date">
          <Input
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit" icon={FiSave} loading={loading}>
            {loading ? "Saving..." : "Save insurance"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default InsuranceForm;
