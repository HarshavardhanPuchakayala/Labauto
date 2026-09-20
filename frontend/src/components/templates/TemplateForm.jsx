import { useState } from "react";
import { FiLayers, FiList, FiPlus, FiTrash2 } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance";
import Alert from "../ui/Alert";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Card, { CardBody, CardHeader } from "../ui/Card";
import { Field, Input } from "../ui/Form";

const emptyField = {
  label: "",
  key: "",
  unit: "",
  type: "number",
  normalRange: { min: "", max: "" },
  referenceNote: "",
};

const FIELD_TYPES = [
  { value: "number", label: "Number" },
  { value: "text", label: "Text" },
];

// Drag-handle look only: rows are not actually draggable.
function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      {[3, 8, 13].flatMap((y) =>
        [5, 11].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" />)
      )}
    </svg>
  );
}

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
    <Card className="mb-6">
      <CardHeader
        icon={FiLayers}
        title="Create test template"
        description="Define the values a technician records for this test."
      />

      <CardBody>
        {error && <Alert className="mb-5">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Field label="Template name" className="max-w-md">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. CBC"
            />
          </Field>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Fields</h3>
                <Badge>{fields.length}</Badge>
              </div>
              {fields.length > 0 && (
                <Button size="sm" icon={FiPlus} onClick={addField}>
                  Add field
                </Button>
              )}
            </div>

            {fields.length === 0 && (
              <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-teal-600 ring-1 ring-inset ring-slate-200">
                  <FiList className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-slate-900">No fields yet</p>
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                  Each field is one value a technician records, such as Hemoglobin or WBC count.
                </p>
                <Button className="mt-4" icon={FiPlus} onClick={addField}>
                  Add the first field
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="text-slate-400">
                        <GripIcon />
                      </span>
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-semibold tabular-nums text-white">
                        {index + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-slate-700">
                        {field.label || "Untitled field"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      aria-label={`Remove field ${index + 1}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <FiTrash2 className="h-4 w-4" aria-hidden="true" />
                      Remove
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <Field label="Label">
                        <Input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateField(index, "label", e.target.value)}
                          required
                          placeholder="Hemoglobin"
                        />
                      </Field>

                      <Field label="Key">
                        <Input
                          type="text"
                          value={field.key}
                          onChange={(e) => updateField(index, "key", e.target.value)}
                          required
                          placeholder="hemoglobin"
                        />
                      </Field>

                      <Field label="Unit">
                        <Input
                          type="text"
                          value={field.unit}
                          onChange={(e) => updateField(index, "unit", e.target.value)}
                          placeholder="g/dL"
                        />
                      </Field>

                      <div>
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                          Type
                        </span>
                        <div
                          role="group"
                          aria-label={`Type of field ${index + 1}`}
                          className="inline-flex rounded-lg bg-slate-100 p-0.5"
                        >
                          {FIELD_TYPES.map((option) => {
                            const active = field.type === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => updateField(index, "type", option.value)}
                                className={`h-9 rounded-md px-4 text-sm font-medium transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
                                  active
                                    ? "bg-white text-slate-900 shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Reference range row */}
                    <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 md:grid-cols-3">
                      {field.type === "number" ? (
                        <>
                          <Field label="Normal range: min">
                            <Input
                              type="number"
                              step="any"
                              value={field.normalRange.min}
                              onChange={(e) => updateRange(index, "min", e.target.value)}
                              suffix={field.unit || undefined}
                              placeholder="e.g. 13"
                            />
                          </Field>
                          <Field label="Normal range: max">
                            <Input
                              type="number"
                              step="any"
                              value={field.normalRange.max}
                              onChange={(e) => updateRange(index, "max", e.target.value)}
                              suffix={field.unit || undefined}
                              placeholder="e.g. 17"
                            />
                          </Field>
                          <Field label="Note (optional)">
                            <Input
                              type="text"
                              value={field.referenceNote}
                              onChange={(e) => updateField(index, "referenceNote", e.target.value)}
                              placeholder="e.g. Male: 13–17, Female: 12–15"
                            />
                          </Field>
                        </>
                      ) : (
                        <Field label="Expected value / note" className="md:col-span-3">
                          <Input
                            type="text"
                            value={field.referenceNote}
                            onChange={(e) => updateField(index, "referenceNote", e.target.value)}
                            placeholder="e.g. Negative, Clear, Nil"
                          />
                        </Field>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {fields.length > 0 && (
                <button
                  type="button"
                  onClick={addField}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-teal-400 hover:bg-teal-50/50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <FiPlus className="h-4 w-4" aria-hidden="true" />
                  Add another field
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-slate-100 pt-5">
            <Button type="submit" icon={FiLayers} loading={loading}>
              {loading ? "Creating..." : "Create template"}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default TemplateForm;
