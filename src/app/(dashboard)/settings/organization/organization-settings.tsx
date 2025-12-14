"use client";

import { useState } from "react";
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
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [industry, setIndustry] = useState<string>("technology");
  const [companySize, setCompanySize] = useState<string>("51-200");
  const [country, setCountry] = useState<string>("DE");
  const [hasEuPresence, setHasEuPresence] = useState(true);
  const [legalName, setLegalName] = useState("Acme Corporation GmbH");
  const [vatNumber, setVatNumber] = useState("DE123456789");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form data:", { companyName, industry, companySize, country, hasEuPresence, legalName, vatNumber });
    addToast({
      title: "Settings saved",
      message: "Your organization settings have been updated successfully.",
      type: "success",
    });
  };

  return (
    <div className="px-6 py-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
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
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-secondary pt-5">
            <Button type="button" color="secondary" size="md">
              Cancel
            </Button>
            <Button type="submit" color="primary" size="md">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationSettings;
