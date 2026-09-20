
import { useEffect, useState } from "react";

import axiosInstance from "../../api/axiosInstance.js";

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

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium">
              {field.label}

              {field.unit && (
                <span className="ml-1 text-gray-500">
                  ({field.unit})
                </span>
              )}
            </label>

            <input
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
              className="w-full rounded-md border px-3 py-2"
              placeholder={`Enter ${field.label}`}
            />

            {field.normalRange && (
              <p className="mt-1 text-xs text-gray-500">
                Normal range: {field.normalRange.min}–
                {field.normalRange.max} {field.unit}
              </p>
            )}

            {field.referenceNote && (
              <p className="mt-1 text-xs text-gray-500">
                {field.referenceNote}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving Results..."
            : "Submit Results"}
        </button>
      </form>
    </div>
  );
}

export default EnterResultsForm;
