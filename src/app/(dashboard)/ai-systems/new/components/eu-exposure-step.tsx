"use client";

import { People, Global, ShieldTick } from "iconsax-react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { type FormData } from "../data/form-options";
import { cx } from "@/utils/cx";

interface EUExposureStepProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

export const EUExposureStep = ({ formData, updateFormData }: EUExposureStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">EU Exposure</h2>
        <p className="mt-1 text-sm text-tertiary">
          The EU AI Act applies if you have any connection to the EU market.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <label
          className={cx(
            "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition",
            formData.servesEU
              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
              : "border-secondary hover:border-brand-300"
          )}
          onClick={() => updateFormData({ servesEU: !formData.servesEU })}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100">
            <People size={20} className="text-brand-600" color="currentColor" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-primary">Serves EU Users/Customers</p>
            <p className="mt-1 text-sm text-tertiary">
              This AI system is used by or affects people in the European Union.
            </p>
          </div>
          <Checkbox isSelected={formData.servesEU} onChange={() => {}} />
        </label>

        <label
          className={cx(
            "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition",
            formData.processesInEU
              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
              : "border-secondary hover:border-brand-300"
          )}
          onClick={() => updateFormData({ processesInEU: !formData.processesInEU })}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
            <Global size={20} className="text-purple-600" color="currentColor" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-primary">Data Processed in EU</p>
            <p className="mt-1 text-sm text-tertiary">
              Data is stored or processed on servers located in the European Union.
            </p>
          </div>
          <Checkbox isSelected={formData.processesInEU} onChange={() => {}} />
        </label>

        <label
          className={cx(
            "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition",
            formData.establishedInEU
              ? "border-brand-600 bg-brand-50 ring-2 ring-brand-600"
              : "border-secondary hover:border-brand-300"
          )}
          onClick={() => updateFormData({ establishedInEU: !formData.establishedInEU })}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-success-100">
            <ShieldTick size={20} className="text-success-600" color="currentColor" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-primary">Company Established in EU</p>
            <p className="mt-1 text-sm text-tertiary">
              Your organization has a legal entity or office in the European Union.
            </p>
          </div>
          <Checkbox isSelected={formData.establishedInEU} onChange={() => {}} />
        </label>
      </div>

      {!formData.servesEU && !formData.processesInEU && !formData.establishedInEU && (
        <div className="rounded-lg border border-secondary bg-secondary_subtle p-4">
          <p className="text-sm text-tertiary">
            If you have no EU exposure, the EU AI Act may not apply to this system. However, we recommend tracking it for best practices.
          </p>
        </div>
      )}
    </div>
  );
};

export default EUExposureStep;
