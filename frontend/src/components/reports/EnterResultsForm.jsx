import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiCheck, FiSave } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Input } from "../ui/Form";

const RANGE_BADGES = {
  low: { tone: "warning", icon: FiArrowDown, label: "Below range" },
  high: { tone: "warning", icon: FiArrowUp, label: "Above range" },
  normal: { tone: "success", icon: FiCheck, label: "In range" },
};

// Display only: never blocks submitting, never changes what is sent.
const getRangeState = (field, rawValue) => {
  if (field.type !== "number" || !field.normalRange) return null;
  if (rawValue === "" || rawValue === null || rawValue === undefined) return null;

  const value = Number(rawValue);
  const min = Number(field.normalRange.min);
  const max = Number(field.normalRange.max);
  if (Number.isNaN(value) || Number.isNaN(min) || Number.isNaN(max)) return null;

  if (value < min) return "low";
  if (value > max) return "high";
  return "normal";
};

function EnterResultsForm({ report, onUpdated }) {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = report.testTemplate?.fields || [];

  useEffect(() => {
    const initialResults = {};

    fields.forEach((field) => {
      initialResults[field.key] = "";
    });

    setResults(initialResults);
  }, [report]);

  const handleChange = (key, value) => {
    setResults((prevResults) => ({
      ...prevResults,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const transformedResults = fields.map((field) => {
      const rawValue = results[field.key];

      return {
        key: field.key,
        value:
          field.type === "number"
            ? Number(rawValue)
            : rawValue,
      };
    });

    const hasEmptyValue = transformedResults.some(
      (item) =>
        item.value === "" ||
        item.value === null ||
        item.value === undefined
    );

    if (hasEmptyValue) {
      setError("Please enter a value for every field.");
      return;
    }

    const hasInvalidNumber = transformedResults.some(
      (item, index) =>
        fields[index].type === "number" &&
        Number.isNaN(item.value)
    );

    if (hasInvalidNumber) {
      setError("Please enter valid numbers for numeric fields.");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.patch(
        `/reports/${report._id}/enter-results`,
        {
          results: transformedResults,
        }
      );

      await onUpdated();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to enter results."
      );
    } finally {
      setLoading(false);
    }
  };

  const filledCount = fields.filter((field) => (results[field.key] ?? "") !== "").length;
  const progress = fields.length ? Math.round((filledCount / fields.length) * 100) : 0;

  return (
    <div>
      {error && <Alert className="mb-5">{error}</Alert>}

      {fields.length === 0 && (
        <Alert tone="info" className="mb-5">
          This template has no fields to fill in.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
          {fields.map((field) => {
            const rangeState = getRangeState(field, results[field.key]);
            const badge = rangeState ? RANGE_BADGES[rangeState] : null;

            return (
              <div key={field.key}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    {field.label}
                  </span>

                  <Input
                    type={
                      field.type === "number"
                        ? "number"
                        : "text"
                    }
                    value={results[field.key] ?? ""}
                    onChange={(e) =>
                      handleChange(
                        field.key,
                        e.target.value
                      )
                    }
                    required
                    step={
                      field.type === "number"
                        ? "any"
                        : undefined
                    }
                    suffix={field.unit || undefined}
                    state={rangeState === "low" || rangeState === "high" ? "warning" : undefined}
                    placeholder={`Enter ${field.label}`}
                  />
                </label>

                <div className="mt-1.5 flex items-start justify-between gap-2">
                  <div className="min-w-0 text-xs text-slate-500">
                    {field.normalRange && (
                      <p>
                        Normal range: {field.normalRange.min}–
                        {field.normalRange.max} {field.unit}
                      </p>
                    )}

                    {field.referenceNote && <p>{field.referenceNote}</p>}
                  </div>

                  <span aria-live="polite" className="shrink-0">
                    {badge && (
                      <Badge tone={badge.tone} icon={badge.icon} size="sm">
                        {badge.label}
                      </Badge>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sticky bottom-0 z-10 mt-8 flex flex-col gap-3 border-t border-slate-200 bg-white/95 pb-1 pt-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:w-56">
            <p className="text-sm tabular-nums text-slate-600">
              <span className="font-semibold text-slate-900">{filledCount}</span> of{" "}
              {fields.length} filled
            </p>
            <div
              role="progressbar"
              aria-label="Fields filled"
              aria-valuemin={0}
              aria-valuemax={fields.length}
              aria-valuenow={filledCount}
              className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-teal-500 transition-all duration-300 motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button type="submit" size="lg" icon={FiSave} loading={loading}>
            {loading
              ? "Saving Results..."
              : "Submit results"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EnterResultsForm;
