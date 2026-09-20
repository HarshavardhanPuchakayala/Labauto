import { FiClipboard, FiLayers, FiPlus } from "react-icons/fi";

import Button from "../ui/Button";
import Card from "../ui/Card";
import EmptyState from "../ui/EmptyState";

const PREVIEW_COUNT = 4;

// onAddTemplate is optional, so existing usages keep working.
function TemplateList({ templates, onAddTemplate }) {
  if (templates.length === 0) {
    return (
      <Card>
        <EmptyState
          icon={FiLayers}
          title="No test templates yet"
          description="A template defines what gets measured in a test, like the fields in a Complete Blood Count."
          action={
            onAddTemplate && (
              <Button icon={FiPlus} onClick={onAddTemplate}>
                Create your first template
              </Button>
            )
          }
        />
      </Card>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <Card as="li" key={template._id} className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <FiClipboard className="h-[18px] w-[18px]" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="break-words font-semibold text-slate-900">{template.name}</h3>
              <p className="mt-0.5 text-sm tabular-nums text-slate-500">
                {template.fields.length} {template.fields.length === 1 ? "field" : "fields"}
              </p>
            </div>
          </div>

          {template.fields.length > 0 && (
            <ul aria-label="Fields in this template" className="mt-4 flex flex-wrap gap-1.5">
              {template.fields.slice(0, PREVIEW_COUNT).map((field, index) => (
                <li
                  key={field.key ?? index}
                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                >
                  {field.label}
                </li>
              ))}
              {template.fields.length > PREVIEW_COUNT && (
                <li className="px-1 py-1 text-xs text-slate-500">
                  +{template.fields.length - PREVIEW_COUNT} more
                </li>
              )}
            </ul>
          )}
        </Card>
      ))}
    </ul>
  );
}

export default TemplateList;
