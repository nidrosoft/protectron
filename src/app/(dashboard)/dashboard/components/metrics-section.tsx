"use client";

import { MetricsChart04 } from "@/components/application/metrics/metrics";

interface DocumentStats {
  total: number;
  byType: {
    technical: number;
    risk: number;
    policy: number;
    model_card: number;
  };
}

interface PendingActionsStats {
  total: number;
  urgent: number;
  upcoming: number;
}

interface MetricsSectionProps {
  overallProgress: number;
  totalSystems: number;
  completedRequirements: number;
  totalRequirements: number;
  documents: DocumentStats;
  pendingActions: PendingActionsStats;
}

export const MetricsSection = ({
  overallProgress,
  totalSystems,
  completedRequirements,
  totalRequirements,
  documents,
  pendingActions,
}: MetricsSectionProps) => {
  // Calculate pending requirements (not completed) for display
  const pendingRequirements = totalRequirements - completedRequirements;
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <MetricsChart04
        title={`${overallProgress}%`}
        subtitle="Compliance Score"
        change="12%"
        changeTrend="positive"
        changeDescription="vs last month"
        chartColor="text-fg-success-secondary"
        chartData={[
          { value: 45 }, { value: 48 }, { value: 52 }, { value: 55 },
          { value: 58 }, { value: 60 }, { value: 62 },
        ]}
      />
      <MetricsChart04
        title={`${totalSystems}`}
        subtitle="AI Systems"
        change="2"
        changeTrend="positive"
        changeDescription="new this month"
        chartColor="text-fg-brand-primary"
        chartData={[
          { value: 2 }, { value: 2 }, { value: 3 }, { value: 3 },
          { value: 4 }, { value: 4 }, { value: 5 },
        ]}
      />
      <MetricsChart04
        title={`${completedRequirements}/${totalRequirements}`}
        subtitle="Requirements Done"
        change={`${completedRequirements}`}
        changeTrend="positive"
        changeDescription="completed"
        chartColor="text-fg-success-secondary"
        chartData={[
          { value: 20 }, { value: 25 }, { value: 30 }, { value: 34 },
          { value: 38 }, { value: 40 }, { value: 42 },
        ]}
      />
      <MetricsChart04
        title={`${documents.total}`}
        subtitle="Documents"
        change={`${documents.total}`}
        changeTrend="positive"
        changeDescription="generated"
        chartColor="text-fg-brand-primary"
        chartData={[
          { value: 5 }, { value: 6 }, { value: 8 }, { value: 9 },
          { value: 10 }, { value: 11 }, { value: documents.total || 0 },
        ]}
      />
      <MetricsChart04
        title={`${pendingRequirements}`}
        subtitle="Pending Actions"
        change={`${pendingActions.urgent}`}
        changeTrend={pendingActions.urgent > 0 ? "negative" : "positive"}
        changeDescription="urgent"
        chartColor="text-fg-error-secondary"
        chartData={[
          { value: 5 }, { value: 6 }, { value: 7 }, { value: 8 },
          { value: 9 }, { value: 8 }, { value: pendingRequirements || 0 },
        ]}
      />
    </div>
  );
};

export default MetricsSection;
