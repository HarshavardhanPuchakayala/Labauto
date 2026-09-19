import { useState } from "react";
import axiosInstance from "../../api/axiosInstance.js";

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
    <div className="mb-4 rounded-md border bg-gray-50 p-4">
      {error && <div className="mb-3 rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
        <input name="provider" value={formData.provider} onChange={handleChange} required placeholder="Provider (e.g. Star Health)" className="rounded-md border px-3 py-2" />
        <input name="policyNumber" value={formData.policyNumber} onChange={handleChange} required placeholder="Policy Number" className="rounded-md border px-3 py-2" />
        <input name="policyHolderName" value={formData.policyHolderName} onChange={handleChange} required placeholder="Policy Holder Name" className="rounded-md border px-3 py-2" />
        <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="rounded-md border px-3 py-2" />
        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">
            {loading ? "Saving..." : "Save Insurance"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default InsuranceForm;