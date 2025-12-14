"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Badge } from "@/components/base/badges/badges";
import { dataTypes, dataSubjects, type FormData } from "../data/form-options";
import { cx } from "@/utils/cx";

interface DataPrivacyStepProps {
  formData: FormData;
  toggleArrayItem: (field: "dataTypes" | "dataSubjects", item: string) => void;
}

export const DataPrivacyStep = ({ formData, toggleArrayItem }: DataPrivacyStepProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-primary">Data & Privacy</h2>
        <p className="mt-1 text-sm text-tertiary">
          What types of data does this AI system process?
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-primary">
          Data Types Processed <span className="text-error-500">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {dataTypes.map((dt) => (
            <label
              key={dt.id}
              className={cx(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                formData.dataTypes.includes(dt.id)
                  ? "border-brand-600 bg-brand-50"
                  : "border-secondary hover:border-brand-300"
              )}
            >
              <Checkbox
                isSelected={formData.dataTypes.includes(dt.id)}
                onChange={() => toggleArrayItem("dataTypes", dt.id)}
              />
              <span className="text-sm text-primary">{dt.label}</span>
              {dt.warning && (
                <Badge color="warning" size="sm">High Risk</Badge>
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-primary">
          Who is affected by this AI system?
        </label>
        <div className="flex flex-col gap-2">
          {dataSubjects.map((ds) => (
            <label
              key={ds.id}
              className={cx(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                formData.dataSubjects.includes(ds.id)
                  ? "border-brand-600 bg-brand-50"
                  : "border-secondary hover:border-brand-300"
              )}
            >
              <Checkbox
                isSelected={formData.dataSubjects.includes(ds.id)}
                onChange={() => toggleArrayItem("dataSubjects", ds.id)}
              />
              <span className="text-sm text-primary">{ds.label}</span>
              {ds.warning && (
                <Badge color="warning" size="sm">EU Exposure</Badge>
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyStep;
