import { useState } from "react";
import { FiBriefcase, FiCalendar, FiMail, FiPhone, FiPlus } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Card, { CardBody, CardHeader } from "../ui/Card";
import { Field, Input, Textarea } from "../ui/Form";

function LabForm({ onLabCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    subscriptionExpiresAt: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/labs",
        formData
      );

      const newLab = response.data.lab;

      onLabCreated(newLab);

      setFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        subscriptionExpiresAt: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create lab. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader
        icon={FiBriefcase}
        title="Create lab"
        description="Add a lab and set when its subscription expires."
      />

      <CardBody>
        {error && <Alert className="mb-5">{error}</Alert>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Lab name">
            <Input
              icon={FiBriefcase}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter lab name"
            />
          </Field>

          <Field label="Phone">
            <Input
              icon={FiPhone}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </Field>

          <Field label="Email">
            <Input
              icon={FiMail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </Field>

          <Field label="Subscription expires on">
            <Input
              icon={FiCalendar}
              type="date"
              name="subscriptionExpiresAt"
              value={formData.subscriptionExpiresAt}
              onChange={handleChange}
              required
            />
          </Field>

          <Field label="Address" className="md:col-span-2">
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Enter lab address"
            />
          </Field>

          <div className="flex items-center gap-2 md:col-span-2">
            <Button type="submit" icon={FiPlus} loading={loading}>
              {loading ? "Creating..." : "Create lab"}
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

export default LabForm;
