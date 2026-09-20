import { useCallback, useEffect, useState } from "react";
import {
  FiFileText,
  FiImage,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiTag,
  FiUpload,
  FiUploadCloud,
  FiBriefcase,
} from "react-icons/fi";

import axiosInstance from "../api/axiosInstance";
import Alert from "../components/ui/Alert";
import Badge, { SubscriptionBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card, { CardBody, CardHeader } from "../components/ui/Card";
import { Field, Input, Textarea } from "../components/ui/Form";
import { FlaskIcon } from "../components/ui/Logo";
import PageHeader from "../components/ui/PageHeader";
import { CardSkeleton } from "../components/ui/Skeleton";

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
    return (
      <div className="space-y-6">
        <CardSkeleton lines={5} />
        <CardSkeleton lines={2} />
      </div>
    );
  }

  if (!lab) {
    return <Alert>{error}</Alert>;
  }

  return (
    <>
      <PageHeader
        title="Lab Profile"
        description="Manage your lab's information and branding"
      />

      {error && <Alert className="mb-4">{error}</Alert>}
      {success && (
        <Alert tone="success" className="mb-4">
          {success}
        </Alert>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader
              icon={FiSettings}
              title="Lab details"
              description="Shown on your reports and used across your account."
            />
            <CardBody>
              <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
                <span>
                  Lab ID{" "}
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-700">
                    {lab.labId}
                  </span>
                </span>
                <SubscriptionBadge status={lab.subscriptionStatus} />
                <span>Subscription is managed by the platform owner.</span>
              </div>

              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <Field label="Lab name">
                  <Input
                    icon={FiBriefcase}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
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
                  />
                </Field>

                <Field label="Tagline" hint={`${formData.tagline.length}/120`}>
                  <Input
                    icon={FiTag}
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleChange}
                    placeholder="e.g. Trusted Diagnostics Since 2015"
                    maxLength={120}
                  />
                </Field>

                <Field label="Address" className="md:col-span-2">
                  <Textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                  />
                </Field>

                <div className="md:col-span-2">
                  <Button type="submit" icon={FiSave} loading={saving}>
                    {saving ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              icon={FiImage}
              title="Report logo"
              description="Used as the letterhead logo and watermark on generated PDF reports."
              action={
                lab.hasLogo ? (
                  <Badge tone="success">Logo set</Badge>
                ) : (
                  <Badge>No logo yet</Badge>
                )
              }
            />
            <CardBody>
              <p className="mb-4 text-sm text-slate-500">
                {lab.hasLogo ? "A logo is currently set for your reports." : "No logo uploaded yet."}
              </p>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition-colors duration-200 hover:border-teal-400 hover:bg-teal-50/50 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/25">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoChange}
                  className="sr-only"
                />
                <FiUploadCloud className="mb-2 h-7 w-7 text-teal-600" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-900">
                  {logoFile ? logoFile.name : "Choose a logo file"}
                </span>
                <span className="mt-1 text-xs text-slate-500">PNG or JPG</span>
              </label>

              <div className="mt-4">
                <Button
                  variant="dark"
                  icon={FiUpload}
                  onClick={handleLogoUpload}
                  loading={uploadingLogo}
                >
                  {uploadingLogo ? "Uploading..." : "Upload logo"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card className="xl:sticky xl:top-6">
          <CardHeader
            icon={FiFileText}
            title="Letterhead preview"
            description="Updates as you type. Your uploaded logo appears here on the PDF."
          />
          <CardBody>
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-5">
              <FlaskIcon className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 text-teal-600 opacity-[0.06]" />

              <div className="relative">
                <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-dashed border-slate-300 text-slate-400">
                    <FiImage className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {formData.name || "Your lab name"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {formData.tagline || "Your tagline"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 py-5" aria-hidden="true">
                  <div className="h-2 w-2/3 rounded bg-slate-100" />
                  <div className="h-2 w-full rounded bg-slate-100" />
                  <div className="h-2 w-5/6 rounded bg-slate-100" />
                  <div className="h-2 w-1/2 rounded bg-slate-100" />
                </div>

                <div className="space-y-0.5 border-t border-slate-200 pt-3 text-xs text-slate-500">
                  <p className="break-words">
                    {[formData.phone, formData.email].filter(Boolean).join(" · ") ||
                      "Phone and email"}
                  </p>
                  <p className="flex items-start gap-1 break-words">
                    <FiMapPin className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    {formData.address || "Lab address"}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export default LabProfile;
