"use client";

import { Checkbox } from "@/components/base/checkbox/checkbox";
import { type AssessmentData } from "../data/assessment-options";
import { cx } from "@/utils/cx";

interface EUPresenceStepProps {
  data: AssessmentData;
  updateData: (field: keyof AssessmentData, value: unknown) => void;
}

export const EUPresenceStep = ({ data, updateData }: EUPresenceStepProps) => {
  return (
    <div className="space-y-6">
      {/* Context Box */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
        <p className="text-sm font-medium text-brand-700">Why does this matter?</p>
        <p className="mt-1 text-sm text-brand-600">
          The EU AI Act has extraterritorial reach. Even if your company is based outside the EU, you may still need to comply if you have any connection to the EU market. Understanding your EU exposure is the first step in determining your compliance obligations.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-md font-semibold text-primary">Select all that apply to your organization:</p>
      </div>
      
      <div className="space-y-4">
        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasEUCustomers ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasEUCustomers}
            onChange={(checked) => updateData("hasEUCustomers", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasEUCustomers ? "text-gray-900" : "text-primary"
            )}>EU Customers or Users</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasEUCustomers ? "text-gray-600" : "text-tertiary"
            )}>Your products or services are used by individuals or businesses located in any EU member state, including through online platforms or digital services.</p>
          </div>
        </label>

        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.hasEUOperations ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.hasEUOperations}
            onChange={(checked) => updateData("hasEUOperations", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.hasEUOperations ? "text-gray-900" : "text-primary"
            )}>EU Business Operations</p>
            <p className={cx(
              "mt-1 text-sm",
              data.hasEUOperations ? "text-gray-600" : "text-tertiary"
            )}>You have offices, subsidiaries, employees, or any form of business establishment within the European Union.</p>
          </div>
        </label>

        <label className={cx(
          "flex items-start gap-4 rounded-xl border p-5 cursor-pointer transition-colors",
          data.processesEUData ? "border-brand-500 bg-brand-50" : "border-secondary bg-primary hover:bg-secondary"
        )}>
          <Checkbox
            isSelected={data.processesEUData}
            onChange={(checked) => updateData("processesEUData", checked)}
          />
          <div>
            <p className={cx(
              "font-semibold",
              data.processesEUData ? "text-gray-900" : "text-primary"
            )}>EU Data Processing</p>
            <p className={cx(
              "mt-1 text-sm",
              data.processesEUData ? "text-gray-600" : "text-tertiary"
            )}>Your AI systems process personal data of EU residents, regardless of where the processing takes place. This includes data collected through websites, apps, or third-party services.</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default EUPresenceStep;
