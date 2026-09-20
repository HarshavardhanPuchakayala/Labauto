import { useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiUser, FiUserPlus } from "react-icons/fi";

import axiosInstance from "../../api/axiosInstance.js";
import Alert from "../ui/Alert";
import Button from "../ui/Button";
import Card, { CardBody, CardHeader } from "../ui/Card";
import { Field, Input, Select } from "../ui/Form";

function PatientForm({ onPatientCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
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
      const response = await axiosInstance.post("/patients", formData);

      onPatientCreated(response.data.patient);

      setFormData({
        name: "",
        dob: "",
        gender: "",
        phone: "",
        email: "",
        address: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader
        icon={FiUserPlus}
        title="Add patient"
        description="Name, date of birth and gender are required."
      />

      <CardBody>
        {error && <Alert className="mb-5">{error}</Alert>}

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <Input
              icon={FiUser}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Field>

          <Field label="Date of birth">
            <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
          </Field>

          <Field label="Gender">
            <Select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </Field>

          <Field label="Phone">
            <Input
              icon={FiPhone}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Field>

          <Field label="Email">
            <Input
              icon={FiMail}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Field>

          <Field label="Address">
            <Input
              icon={FiMapPin}
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Field>

          <div className="flex items-center gap-2 md:col-span-2">
            <Button type="submit" loading={loading} icon={FiUserPlus}>
              {loading ? "Creating..." : "Create patient"}
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

export default PatientForm;
