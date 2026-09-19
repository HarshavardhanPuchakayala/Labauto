import { useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

function LabForm({ onLabCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    subscriptionExpiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/labs",
        formData
      );

      const newLab = response.data.lab;

      onLabCreated(newLab);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        subscriptionExpiresAt: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create lab. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Create Lab
        </h2>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Name */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Lab Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter lab name"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Phone
          </label>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="mb-1 block text-sm font-medium">
            Subscription Expires On
          </label>

          <input
            type="date"
            name="subscriptionExpiresAt"
            value={formData.subscriptionExpiresAt}
            onChange={handleChange}
            required
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">
            Address
          </label>

          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter lab address"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Lab"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LabForm;