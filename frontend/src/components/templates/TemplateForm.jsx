import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const emptyField = {
  label: "",
  key: "",
  unit: "",
  type: "number",
};

function TemplateForm({ onTemplateCreated, onCancel }) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addField = () => {
    setFields((prevFields) => [
      ...prevFields,
      { ...emptyField },
    ]);
  };

  const removeField = (index) => {
    setFields((prevFields) =>
      prevFields.filter((_, i) => i !== index)
    );
  };

  const updateField = (index, fieldName, value) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index
          ? { ...field, [fieldName]: value }
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
      const response = await axiosInstance.post("/test-templates", {
        name,
        fields,
      });

      const newTemplate = response.data.template;

      onTemplateCreated(newTemplate);

      setName("");
      setFields([]);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create template. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Create Test Template
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Template Name
          </label>

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
              <div
                key={index}
                className="rounded-md border bg-gray-50 p-4"
              >
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-sm">
                      Label
                    </label>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) =>
                        updateField(
                          index,
                          "label",
                          e.target.value
                        )
                      }
                      required
                      placeholder="Hemoglobin"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm">
                      Key
                    </label>

                    <input
                      type="text"
                      value={field.key}
                      onChange={(e) =>
                        updateField(
                          index,
                          "key",
                          e.target.value
                        )
                      }
                      required
                      placeholder="hemoglobin"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm">
                      Unit
                    </label>

                    <input
                      type="text"
                      value={field.unit}
                      onChange={(e) =>
                        updateField(
                          index,
                          "unit",
                          e.target.value
                        )
                      }
                      placeholder="g/dL"
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm">
                      Type
                    </label>

                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateField(
                          index,
                          "type",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border px-3 py-2"
                    >
                      <option value="number">Number</option>
                      <option value="text">Text</option>
                    </select>
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