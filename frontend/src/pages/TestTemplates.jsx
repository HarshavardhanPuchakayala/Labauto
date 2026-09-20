import { useEffect, useState } from "react";
import { FiDownload, FiPlus, FiX } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import TemplateForm from "../components/templates/TemplateForm";
import TemplateList from "../components/templates/TemplateList";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";

function TestTemplates() {
  const { showToast } = useToast();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
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
    showToast("Template created successfully");
  };

  const handleTemplateUpdated = (updatedTemplate) => {
    setTemplates((prev) => prev.map((t) => (t._id === updatedTemplate._id ? updatedTemplate : t)));
    setEditingTemplate(null);
    showToast("Template updated successfully");
  };

  const handleEditTemplate = (template) => {
    setShowForm(false);
    setEditingTemplate(template);
  };

  const handleLoadStandardTemplates = async () => {
    setError("");
    setSeeding(true);
    try {
      const response = await axiosInstance.post("/test-templates/seed-defaults");
      showToast(response.data.message);
      await fetchTemplates();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to load standard templates.", "error");
    } finally {
      setSeeding(false);
    }
  };

  const formVisible = showForm || Boolean(editingTemplate);

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
            <Button
              icon={formVisible ? FiX : FiPlus}
              onClick={() => {
                if (formVisible) {
                  setShowForm(false);
                  setEditingTemplate(null);
                } else {
                  setShowForm(true);
                }
              }}
            >
              {formVisible ? "Close form" : "New template"}
            </Button>
          </div>
        }
      />

      {formVisible && (
        <TemplateForm
          existingTemplate={editingTemplate}
          onTemplateCreated={handleTemplateCreated}
          onTemplateUpdated={handleTemplateUpdated}
          onCancel={() => {
            setShowForm(false);
            setEditingTemplate(null);
          }}
        />
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
        <TemplateList
          templates={templates}
          onAddTemplate={() => setShowForm(true)}
          onEditTemplate={handleEditTemplate}
        />
      )}
    </>
  );
}

export default TestTemplates;