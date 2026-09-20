import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiLock, FiLogIn, FiMail } from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import { setCredentials } from "../features/auth/authSlice";
import Alert from "../components/ui/Alert";
import AuthShell from "../components/ui/AuthShell";
import Button from "../components/ui/Button";
import { Field, Input } from "../components/ui/Form";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { user, token } = response.data;

      dispatch(setCredentials({ user, token }));

      if (user.role === "owner") {
        navigate("/owner-dashboard");
      } else if (user.role === "technician") {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Log in to LabAuto"
      subtitle="Pick up where you left off."
      headline="Every sample, accounted for."
      description="Follow each report from collection to delivery, using your lab's own test templates and letterhead."
      footer={
        <>
          Don't have a lab account yet?{" "}
          <Link
            to="/signup"
            className="font-medium text-teal-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            Sign up
          </Link>
        </>
      }
    >
      {error && <Alert className="mb-5">{error}</Alert>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Email">
          <Input
            icon={FiMail}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </Field>

        <Field label="Password">
          <Input
            icon={FiLock}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </Field>

        <Button type="submit" size="lg" icon={FiLogIn} loading={loading} className="w-full">
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default Login;
