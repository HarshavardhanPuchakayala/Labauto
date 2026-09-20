import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function LabProfile() {
  const [lab, setLab] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    tagline: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLab = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get("/labs/me");
      const labData = response.data.lab;
      setLab(labData);
      setFormData({
        name: labData.name || "",
        phone: labData.phone || "",
        email: labData.email || "",
        address: labData.address || "",
        tagline: labData.tagline || "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load lab profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLab();
  }, [fetchLab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await axiosInstance.patch("/labs/me", formData);
      setLab(response.data.lab);
      setSuccess("Lab profile updated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update lab profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    setLogoFile(e.target.files[0] || null);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setError("Please choose a logo file first.");
      return;
    }

    setError("");
    setSuccess("");
    setUploadingLogo(true);

    try {
      const form = new FormData();
      form.append("logo", logoFile);

      await axiosInstance.post("/labs/me/logo", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Logo uploaded successfully.");
      setLogoFile(null);
      await fetchLab();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to upload logo.");
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return <p className="py-10 text-center text-gray-600">Loading lab profile...</p>;
  }

  if (!lab) {
    return <div className="rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</div>;
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Lab Profile</h1>
        <p className="text-gray-600">Manage your lab's information and branding</p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-100 px-4 py-3 text-sm text-green-700">{success}</div>
      )}

      <div className="mb-6 rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Lab Details</h2>

        <div className="mb-4 text-sm text-gray-500">
          Lab ID: <span className="font-medium text-gray-700">{lab.labId}</span>
          {" · "}
          Subscription: <span className="font-medium text-gray-700">{lab.subscriptionStatus}</span>
          {" (managed by platform owner)"}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Lab Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="e.g. Trusted Diagnostics Since 2015"
              maxLength={120}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows="3"
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Report Logo</h2>
        <p className="mb-4 text-sm text-gray-500">
          {lab.hasLogo ? "A logo is currently set for your reports." : "No logo uploaded yet."}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={handleLogoChange}
            className="text-sm"
          />
          <button
            type="button"
            onClick={handleLogoUpload}
            disabled={uploadingLogo}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploadingLogo ? "Uploading..." : "Upload Logo"}
          </button>
        </div>
      </div>
    </>
  );
}

export default LabProfile;