import { useEffect, useState } from "react";
import { FiDownload, FiPlus, FiX } from "react-icons/fi";

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
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [seeding, setSeeding] = useState(false);

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

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleTemplateCreated = (newTemplate) => {
    setTemplates((prev) => [...prev, newTemplate]);
    setShowForm(false);
  };

  const handleLoadStandardTemplates = async () => {
    setError("");
    setSuccess("");
    setSeeding(true);
    try {
      const response = await axiosInstance.post("/test-templates/seed-defaults");
      setSuccess(response.data.message);
      await fetchTemplates();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load standard templates.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Test Templates"
        description="Create and manage test templates"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={FiDownload}
              onClick={handleLoadStandardTemplates}
              loading={seeding}
            >
              {seeding ? "Loading..." : "Load standard templates"}
            </Button>
            <Button icon={showForm ? FiX : FiPlus} onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? "Close form" : "New template"}
            </Button>
          </div>
        }
      />

      {success && <Alert tone="success" className="mb-4">{success}</Alert>}

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