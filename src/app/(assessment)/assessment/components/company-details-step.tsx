"use client";

import { Input } from "@/components/base/input/input";
import { RadioGroup, RadioButton } from "@/components/base/radio-buttons/radio-buttons";
import { industries, companySizes, countries, type AssessmentData } from "../data/assessment-options";

interface CompanyDetailsStepProps {
  data: AssessmentData;
  updateData: (field: keyof AssessmentData, value: unknown) => void;
}

export const CompanyDetailsStep = ({ data, updateData }: CompanyDetailsStepProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <label className="text-md font-semibold text-primary">Company Name</label>
        <Input
          placeholder="eg. Acme Inc."
          value={data.companyName}
          onChange={(value) => updateData("companyName", value)}
          size="md"
        />
      </div>
      
      <div className="space-y-4">
        <label className="text-md font-semibold text-primary">Industry</label>
        <RadioGroup
          value={data.industry}
          onChange={(value) => updateData("industry", value)}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {industries.map((industry) => (
              <RadioButton key={industry} value={industry} label={industry} />
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <label className="text-md font-semibold text-primary">Company Size</label>
        <RadioGroup
          value={data.companySize}
          onChange={(value) => updateData("companySize", value)}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {companySizes.map((size) => (
              <RadioButton key={size} value={size} label={`${size} employees`} />
            ))}
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <label className="text-md font-semibold text-primary">Country</label>
        <RadioGroup
          value={data.country}
          onChange={(value) => updateData("country", value)}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {countries.map((country) => (
              <RadioButton key={country} value={country} label={country} />
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
