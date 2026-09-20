import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-bold">Create Your Lab Account</h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Start your 14-day free trial — no payment required.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="mb-3 font-semibold text-gray-700">Lab Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="labName"
                value={formData.labName}
                onChange={handleChange}
                required
                placeholder="Lab Name"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="tel"
                name="labPhone"
                value={formData.labPhone}
                onChange={handleChange}
                required
                placeholder="Lab Phone"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="email"
                name="labEmail"
                value={formData.labEmail}
                onChange={handleChange}
                required
                placeholder="Lab Email"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="text"
                name="labAddress"
                value={formData.labAddress}
                onChange={handleChange}
                required
                placeholder="Lab Address"
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-gray-700">Your Account</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="technicianName"
                value={formData.technicianName}
                onChange={handleChange}
                required
                placeholder="Your Name"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="email"
                name="technicianEmail"
                value={formData.technicianEmail}
                onChange={handleChange}
                required
                placeholder="Your Email"
                className="w-full rounded-md border px-3 py-2"
              />
              <input
                type="password"
                name="technicianPassword"
                value={formData.technicianPassword}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="Password (min 8 characters)"
                className="w-full rounded-md border px-3 py-2 md:col-span-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating your account..." : "Create Lab Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LabSignup;