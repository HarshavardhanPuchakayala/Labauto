import { useCallback, useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance.js";
import LabForm from "../components/labs/LabForm.jsx";
import LabTable from "../components/labs/LabTable.jsx";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import PageHeader from "../components/ui/PageHeader";
import { TableSkeleton } from "../components/ui/Skeleton";
import StatStrip from "../components/ui/StatStrip";

function OwnerDashboard() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchLabs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.get(
        "/admin/labs"
      );

      setLabs(response.data.labs);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load labs."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleLabCreated = async () => {
    setShowForm(false);

    await fetchLabs();
  };

  const countStatus = (status) => labs.filter((lab) => lab.subscriptionStatus === status).length;
  const technicianTotal = labs.reduce((sum, lab) => sum + (lab.technicianCount ?? 0), 0);
  const needsAttention = labs.filter(
    (lab) => lab.subscriptionStatus === "expired" || lab.isExpiringSoon
  ).length;

  return (
    <>
      <PageHeader
        title="Owner Dashboard"
        description="Manage labs and subscriptions"
        actions={
          <Button icon={showForm ? FiX : FiPlus} onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? "Close form" : "New lab"}
          </Button>
        }
      />

      {showForm && (
        <LabForm
          onLabCreated={handleLabCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {!error && (
        <StatStrip
          className="mb-6"
          loading={loading}
          items={[
            {
              label: "Total labs",
              value: labs.length,
              tone: "teal",
              hint: `${technicianTotal} ${technicianTotal === 1 ? "technician" : "technicians"} across all labs`,
            },
            { label: "Active", value: countStatus("active"), tone: "emerald" },
            { label: "On trial", value: countStatus("trial"), tone: "sky" },
            {
              label: "Need attention",
              value: needsAttention,
              tone: "amber",
              hint: "Expired or expiring soon",
            },
          ]}
        />
      )}

      {loading && <TableSkeleton rows={5} columns={5} />}

      {error && <Alert className="mb-4">{error}</Alert>}

      {!loading && !error && (
        <LabTable
          labs={labs}
          onRenewed={fetchLabs}
          onAddLab={() => setShowForm(true)}
        />
      )}
    </>
  );
}

export default OwnerDashboard;
