import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const emptyField = {
  label: "",
  key: "",
  unit: "",
  type: "number",
  normalRange: { min: "", max: "" },
  referenceNote: "",
};

function TemplateForm({ onTemplateCreated, onCancel }) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addField = () => {
    setFields((prev) => [...prev, { ...emptyField, normalRange: { ...emptyField.normalRange } }]);
  };

  const removeField = (index) => {
    setFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateField = (index, fieldName, value) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [fieldName]: value } : field))
    );
  };

  const updateRange = (index, boundary, value) => {
    setFields((prev) =>
      prev.map((field, i) =>
        i === index
          ? { ...field, normalRange: { ...field.normalRange, [boundary]: value } }
          : field
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (fields.length === 0) {
      setError("Please add at least one field to the template.");
      return;
    }

    setLoading(true);

    try {
      // Convert range strings to numbers (or omit if blank) before sending
      const preparedFields = fields.map((f) => {
        const hasRange = f.normalRange.min !== "" && f.normalRange.max !== "";
        return {
          label: f.label,
          key: f.key,
          unit: f.unit,
          type: f.type,
          ...(hasRange && {
            normalRange: {
              min: Number(f.normalRange.min),
              max: Number(f.normalRange.max),
            },
          }),
          ...(f.referenceNote && { referenceNote: f.referenceNote }),
        };
      });

      const response = await axiosInstance.post("/test-templates", { name, fields: preparedFields });
      const newTemplate = response.data.template;

      onTemplateCreated(newTemplate);
      setName("");
      setFields([]);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create template. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Create Test Template</h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-700">
            Cancel
          </button>
        )}
      </div>

      {error && <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Template Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g. CBC"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Fields</h3>
            <button
              type="button"
              onClick={addField}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              + Add Field
            </button>
          </div>

          {fields.length === 0 && (
            <p className="rounded-md bg-gray-50 p-4 text-sm text-gray-500">
              No fields added yet. Click "Add Field" to add one.
            </p>
          )}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={index} className="rounded-md border bg-gray-50 p-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm">Label</label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(index, "label", e.target.value)}
                      required
                      placeholder="Hemoglobin"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Key</label>
                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) => updateField(index, "key", e.target.value)}
                      required
                      placeholder="hemoglobin"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Unit</label>
                    <input
                      type="text"
                      value={field.unit}
                      onChange={(e) => updateField(index, "unit", e.target.value)}
                      placeholder="g/dL"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Type</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(index, "type", e.target.value)}
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>

                {/* Reference range row */}
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  {field.type === "number" ? (
                    <>
                      <div>
                        <label className="mb-1 block text-sm">Normal Range — Min</label>
                        <input
                          type="number"
                          step="any"
                          value={field.normalRange.min}
                          onChange={(e) => updateRange(index, "min", e.target.value)}
                          placeholder="e.g. 13"
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm">Normal Range — Max</label>
                        <input
                          type="number"
                          step="any"
                          value={field.normalRange.max}
                          onChange={(e) => updateRange(index, "max", e.target.value)}
                          placeholder="e.g. 17"
                          className="w-full rounded-md border px-3 py-2"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm">Expected Value / Note</label>
                      <input
                        type="text"
                        value={field.referenceNote}
                        onChange={(e) => updateField(index, "referenceNote", e.target.value)}
                        placeholder="e.g. Negative, Clear, Nil"
                        className="w-full rounded-md border px-3 py-2"
                      />
                    </div>
                  )}
                  <div>
                    <label className="mb-1 block text-sm">Note (optional)</label>
                    <input
                      type="text"
                      value={field.referenceNote}
                      onChange={(e) => updateField(index, "referenceNote", e.target.value)}
                      placeholder="e.g. Male: 13–17, Female: 12–15"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Remove Field
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Template"}
        </button>
      </form>
    </div>
  );
}

export default TemplateForm;