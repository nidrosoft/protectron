"use client";

import { useState, useEffect } from "react";
import type { Key } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Select, type SelectItemType } from "@/components/base/select/select";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { useToast } from "@/components/base/toast/toast";

const industryOptions: SelectItemType[] = [
  { id: "technology", label: "Technology / SaaS" },
  { id: "healthcare", label: "Healthcare" },
  { id: "finance", label: "Finance / Banking" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "retail", label: "Retail / E-commerce" },
  { id: "education", label: "Education" },
  { id: "government", label: "Government" },
  { id: "other", label: "Other" },
];

const companySizeOptions: SelectItemType[] = [
  { id: "1-10", label: "1-10 employees" },
  { id: "11-50", label: "11-50 employees" },
  { id: "51-200", label: "51-200 employees" },
  { id: "201-500", label: "201-500 employees" },
  { id: "501-1000", label: "501-1000 employees" },
  { id: "1000+", label: "1000+ employees" },
];

const countryOptions: SelectItemType[] = [
  { id: "DE", label: "Germany" },
  { id: "FR", label: "France" },
  { id: "NL", label: "Netherlands" },
  { id: "BE", label: "Belgium" },
  { id: "IT", label: "Italy" },
  { id: "ES", label: "Spain" },
  { id: "AT", label: "Austria" },
  { id: "PL", label: "Poland" },
  { id: "SE", label: "Sweden" },
  { id: "US", label: "United States" },
  { id: "UK", label: "United Kingdom" },
  { id: "CA", label: "Canada" },
  { id: "AU", label: "Australia" },
];

export const OrganizationSettings = () => {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [hasEuPresence, setHasEuPresence] = useState(false);
  const [legalName, setLegalName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [trustCenterEnabled, setTrustCenterEnabled] = useState(false);
  const [orgSlug, setOrgSlug] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Fetch organization data on mount
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch("/api/v1/organization");
        if (response.ok) {
          const { data } = await response.json();
          setCompanyName(data.name || "");
          setIndustry(data.industry || "");
          setCompanySize(data.company_size || "");
          setCountry(data.country || "");
          setHasEuPresence(data.has_eu_presence || false);
          setLegalName(data.legal_name || "");
          setVatNumber(data.vat_number || "");
          setTrustCenterEnabled(data.trust_center_enabled || false);
          setOrgSlug(data.slug || "");
          setLogoUrl(data.logo_url || null);
        }
      } catch (error) {
        console.error("Error fetching organization:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrganization();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const response = await fetch("/api/v1/organization", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyName,
          industry,
          company_size: companySize,
          country,
          has_eu_presence: hasEuPresence,
          legal_name: legalName,
          vat_number: vatNumber,
          trust_center_enabled: trustCenterEnabled,
        }),
      });

      if (response.ok) {
        addToast({
          title: "Settings saved",
          message: "Your organization settings have been updated successfully.",
          type: "success",
        });
      } else {
        const { error } = await response.json();
        addToast({
          title: "Error",
          message: error || "Failed to save settings.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error saving organization:", error);
      addToast({
        title: "Error",
        message: "Failed to save settings.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/organization/logo", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { data } = await response.json();
        setLogoUrl(data.logo_url);
        addToast({
          title: "Logo uploaded",
          message: "Your organization logo has been updated.",
          type: "success",
        });
      } else {
        const { error } = await response.json();
        addToast({
          title: "Upload failed",
          message: error || "Failed to upload logo.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      addToast({
        title: "Upload failed",
        message: "Failed to upload logo.",
        type: "error",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const response = await fetch("/api/v1/organization/logo", {
        method: "DELETE",
      });

      if (response.ok) {
        setLogoUrl(null);
        addToast({
          title: "Logo removed",
          message: "Your organization logo has been removed.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error removing logo:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="px-6 py-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-gray-200 rounded" />
            <div className="h-12 w-full bg-gray-200 rounded" />
            <div className="h-12 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Section Header */}
          <div className="border-b border-secondary pb-5">
            <h2 className="text-lg font-semibold text-primary">Company Information</h2>
            <p className="mt-1 text-sm text-tertiary">
              Update your company details and EU AI Act compliance information.
            </p>
          </div>

          {/* Form Fields - Two column layout */}
          <div className="flex flex-col gap-5">
            {/* Organization Logo */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div>
                <label className="text-sm font-medium text-secondary">Organization Logo</label>
                <p className="mt-0.5 text-xs text-tertiary">Displayed on your Trust Center</p>
              </div>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-secondary">
                    <img
                      src={logoUrl}
                      alt="Organization logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-secondary bg-secondary_subtle">
                    <span className="text-2xl font-semibold text-tertiary">
                      {companyName.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={isUploadingLogo}
                    />
                    <span className="inline-flex items-center rounded-lg border border-secondary bg-primary px-3 py-1.5 text-sm font-medium text-secondary hover:bg-secondary_subtle">
                      {isUploadingLogo ? "Uploading..." : logoUrl ? "Change logo" : "Upload logo"}
                    </span>
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="text-xs text-error-600 hover:underline"
                    >
                      Remove logo
                    </button>
                  )}
                  <p className="text-xs text-tertiary">PNG, JPG, WebP or SVG. Max 2MB.</p>
                </div>
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Company Name */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">
                  Company Name <span className="text-brand-500">*</span>
                </label>
                <p className="mt-0.5 text-xs text-tertiary">Your organization&apos;s official name</p>
              </div>
              <div>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Industry */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">
                  Industry <span className="text-brand-500">*</span>
                </label>
                <p className="mt-0.5 text-xs text-tertiary">Primary business sector</p>
              </div>
              <div>
                <Select
                  size="md"
                  placeholder="Select industry"
                  selectedKey={industry}
                  onSelectionChange={(key: Key | null) => key && setIndustry(String(key))}
                  items={industryOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Company Size */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">
                  Company Size <span className="text-brand-500">*</span>
                </label>
                <p className="mt-0.5 text-xs text-tertiary">Number of employees</p>
              </div>
              <div>
                <Select
                  size="md"
                  placeholder="Select company size"
                  selectedKey={companySize}
                  onSelectionChange={(key: Key | null) => key && setCompanySize(String(key))}
                  items={companySizeOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Primary Country */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">
                  Primary Country <span className="text-brand-500">*</span>
                </label>
                <p className="mt-0.5 text-xs text-tertiary">Main country of operation</p>
              </div>
              <div>
                <Select
                  size="md"
                  placeholder="Select country"
                  selectedKey={country}
                  onSelectionChange={(key: Key | null) => key && setCountry(String(key))}
                  items={countryOptions}
                >
                  {(item) => (
                    <Select.Item key={item.id} id={item.id} textValue={item.label}>
                      {item.label}
                    </Select.Item>
                  )}
                </Select>
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* EU Presence */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div>
                <label className="text-sm font-medium text-secondary">EU Presence</label>
                <p className="mt-0.5 text-xs text-tertiary">Does your organization operate within the EU?</p>
              </div>
              <div>
                <div className="flex items-center gap-3 rounded-lg border border-secondary p-4">
                  <Checkbox
                    isSelected={hasEuPresence}
                    onChange={() => setHasEuPresence(!hasEuPresence)}
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">Yes, we operate in the EU</p>
                    <p className="text-xs text-tertiary">
                      This affects which EU AI Act requirements apply.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Legal Entity Name */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">Legal Entity Name</label>
                <p className="mt-0.5 text-xs text-tertiary">For official documentation</p>
              </div>
              <div>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Enter legal entity name"
                  className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* VAT Number */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div className="lg:pt-2">
                <label className="text-sm font-medium text-secondary">VAT Number</label>
                <p className="mt-0.5 text-xs text-tertiary">For billing purposes</p>
              </div>
              <div>
                <input
                  type="text"
                  value={vatNumber}
                  onChange={(e) => setVatNumber(e.target.value)}
                  placeholder="Enter VAT number"
                  className="w-full rounded-lg border border-secondary bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-quaternary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <hr className="h-px w-full border-none bg-border-secondary" />

            {/* Trust Center */}
            <div className="grid grid-cols-1 gap-1.5 lg:grid-cols-[240px_1fr] lg:gap-12">
              <div>
                <label className="text-sm font-medium text-secondary">Public Trust Center</label>
                <p className="mt-0.5 text-xs text-tertiary">Share your compliance status publicly</p>
              </div>
              <div>
                <div className="flex items-center gap-3 rounded-lg border border-secondary p-4">
                  <Checkbox
                    isSelected={trustCenterEnabled}
                    onChange={() => setTrustCenterEnabled(!trustCenterEnabled)}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">Enable Trust Center</p>
                    <p className="text-xs text-tertiary">
                      Allow customers to view your EU AI Act compliance status at a public URL.
                    </p>
                  </div>
                </div>
                {trustCenterEnabled && orgSlug && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 p-3">
                    <span className="text-xs text-brand-700">Your Trust Center URL:</span>
                    <a 
                      href={`/trust-center/${orgSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      {typeof window !== 'undefined' ? window.location.origin : ''}/trust-center/{orgSlug}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-secondary pt-5">
            <Button type="button" color="secondary" size="md" isDisabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" color="primary" size="md" isDisabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSettings;
