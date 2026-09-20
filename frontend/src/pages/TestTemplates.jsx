import { useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import TemplateForm from "../components/templates/TemplateForm";
import TemplateList from "../components/templates/TemplateList";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";

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
      <PageHeader
        title="Test Templates"
        description="Create and manage test templates"
        actions={
          <Button icon={showForm ? FiX : FiPlus} onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "New template"}
          </Button>
        }
      />

      {showForm && (
        <TemplateForm onTemplateCreated={handleTemplateCreated} onCancel={() => setShowForm(false)} />
      )}

      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <CardSkeleton lines={3} />
          <CardSkeleton lines={3} />
          <CardSkeleton lines={3} />
        </div>
      )}

      {error && <Alert className="mb-4">{error}</Alert>}

      {!loading && !error && (
        <TemplateList templates={templates} onAddTemplate={() => setShowForm(true)} />
      )}
    </>
  );
}

export default TestTemplates;
