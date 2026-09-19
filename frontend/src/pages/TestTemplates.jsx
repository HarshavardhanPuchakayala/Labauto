import { useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance";
import TemplateForm from "../components/templates/TemplateForm";
import TemplateList from "../components/templates/TemplateList";

function TestTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axiosInstance.get("/test-templates");
        setTemplates(response.data.templates);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load test templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateCreated = (newTemplate) => {
    setTemplates((prev) => [...prev, newTemplate]);
    setShowForm(false);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Test Templates</h1>
          <p className="text-gray-600">Create and manage test templates</p>
        </div>

        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
        >
          {showForm ? "Close Form" : "New Template"}
        </button>
      </div>

      {showForm && (
        <TemplateForm onTemplateCreated={handleTemplateCreated} onCancel={() => setShowForm(false)} />
      )}

      {loading && <p className="py-6 text-center text-gray-600">Loading templates...</p>}

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>
      )}

      {!loading && !error && <TemplateList templates={templates} />}
    </>
  );
}

export default TestTemplates;