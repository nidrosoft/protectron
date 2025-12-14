import { LoadingIndicator } from "@/components/application/loading-indicator";

export default function ReportsLoading() {
  return (
    <div className="flex h-full min-h-[400px] w-full items-center justify-center">
      <LoadingIndicator type="dot-circle" size="md" label="Loading reports..." />
    </div>
  );
}
