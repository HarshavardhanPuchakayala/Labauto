import { useState } from "react";
import { FiCheckCircle, FiMonitor, FiPackage, FiSend } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";

const OPTIONS = [
  { value: "digital", label: "Digital", description: "Shared as a file", icon: FiMonitor },
  { value: "physical", label: "Physical", description: "Handed over in print", icon: FiPackage },
];

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
    <div className="max-w-xl">
      {error && <Alert className="mb-4">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Delivery method</legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {OPTIONS.map((option) => {
              const selected = deliveryMethod === option.value;
              const Icon = option.icon;

              return (
                <label key={option.value} className="block cursor-pointer">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value={option.value}
                    checked={selected}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="peer sr-only"
                  />
                  <span
                    className={`flex items-start gap-3 rounded-lg border p-4 transition-colors duration-200 motion-reduce:transition-none peer-focus-visible:ring-2 peer-focus-visible:ring-teal-500 peer-focus-visible:ring-offset-2 ${
                      selected
                        ? "border-teal-600 bg-teal-50"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        selected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">
                        {option.label}
                      </span>
                      <span className="block text-xs text-slate-500">{option.description}</span>
                    </span>
                    {selected && (
                      <FiCheckCircle
                        className="ml-auto h-5 w-5 shrink-0 text-teal-600"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <Button type="submit" size="lg" icon={FiSend} loading={loading}>
          {loading ? "Delivering..." : "Deliver report"}
        </Button>
      </form>
    </div>
  );
}

export default DeliverForm;
