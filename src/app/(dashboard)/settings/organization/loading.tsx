import { LoadingIndicator } from "@/components/application/loading-indicator";

export default function OrganizationSettingsLoading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <LoadingIndicator type="dot-circle" size="md" label="Loading organization settings..." />
    </div>
  );
}
