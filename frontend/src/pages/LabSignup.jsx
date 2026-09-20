import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBriefcase,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUserPlus,
} from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Alert from "../components/ui/Alert";
import AuthShell from "../components/ui/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Form";

function LabSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    labName: "",
    labPhone: "",
    labEmail: "",
    labAddress: "",
    technicianName: "",
    technicianEmail: "",
    technicianPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/lab-signup", formData);
      const { user, token } = response.data;

      dispatch(setCredentials({ user, token }));
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      wide
      title="Create your lab account"
      subtitle="Start your 14-day free trial. No payment required."
      headline="Set up your lab in a few minutes."
      description="Register your lab and your technician account together, then start adding patients and reports."
      points={[
        "14-day free trial, no card needed",
        "Custom test templates with normal ranges",
        "Your logo on every PDF report",
      ]}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-teal-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Log in
          </Link>
        </>
      }
    >
      {error && <Alert className="mb-5">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset>
          <legend className="mb-4 text-sm font-semibold text-slate-900">Lab information</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Lab name">
              <Input
                icon={FiBriefcase}
                type="text"
                name="labName"
                value={formData.labName}
                onChange={handleChange}
                required
                placeholder="Lab Name"
              />
            </Field>
            <Field label="Lab phone">
              <Input
                icon={FiPhone}
                type="tel"
                name="labPhone"
                value={formData.labPhone}
                onChange={handleChange}
                required
                placeholder="Lab Phone"
              />
            </Field>
            <Field label="Lab email">
              <Input
                icon={FiMail}
                type="email"
                name="labEmail"
                value={formData.labEmail}
                onChange={handleChange}
                required
                placeholder="Lab Email"
              />
            </Field>
            <Field label="Lab address">
              <Input
                icon={FiMapPin}
                type="text"
                name="labAddress"
                value={formData.labAddress}
                onChange={handleChange}
                required
                placeholder="Lab Address"
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-4 text-sm font-semibold text-slate-900">Your account</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Your name">
              <Input
                icon={FiUser}
                type="text"
                name="technicianName"
                value={formData.technicianName}
                onChange={handleChange}
                required
                placeholder="Your Name"
              />
            </Field>
            <Field label="Your email">
              <Input
                icon={FiMail}
                type="email"
                name="technicianEmail"
                value={formData.technicianEmail}
                onChange={handleChange}
                required
                placeholder="Your Email"
              />
            </Field>
            <Field label="Password" hint="Use at least 8 characters." className="md:col-span-2">
              <Input
                icon={FiLock}
                type="password"
                name="technicianPassword"
                autoComplete="new-password"
                value={formData.technicianPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Password (min 8 characters)"
              />
            </Field>
          </div>
        </fieldset>

        <Button type="submit" size="lg" icon={FiUserPlus} loading={loading} className="w-full">
          {loading ? "Creating your account..." : "Create lab account"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default LabSignup;
