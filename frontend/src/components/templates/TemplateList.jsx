function TemplateList({ templates }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Template Name</th>
            <th className="px-4 py-3">Field Count</th>
          </tr>
        </thead>

        <tbody>
          {templates.map((template) => (
            <tr
              key={template._id}
              className="border-t"
            >
              <td className="px-4 py-3 font-medium">
                {template.name}
              </td>

              <td className="px-4 py-3">
                {template.fields.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {templates.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No test templates found.
        </p>
      )}
    </div>
  );
}

export default TemplateList;