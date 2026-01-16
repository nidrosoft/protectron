import type { GettingStartedTask } from "./types";

export const DEFAULT_GETTING_STARTED_TASKS: Omit<GettingStartedTask, "isCompleted" | "completedAt">[] = [
  {
    id: "complete-assessment",
    title: "Complete assessment",
    description: "Identify your AI systems and compliance needs",
    icon: "📋",
    href: "/assessment",
    order: 1,
  },
  {
    id: "create-account",
    title: "Create account",
    description: "Set up your Protectron account",
    icon: "👤",
    order: 2,
  },
  {
    id: "add-first-ai-system",
    title: "Add your first AI system",
    description: "Register an AI system to track compliance",
    icon: "🤖",
    href: "/ai-systems/new",
    action: "add-ai-system",
    order: 3,
  },
  {
    id: "generate-first-document",
    title: "Generate your first document",
    description: "Create AI-powered compliance documentation",
    icon: "📄",
    href: "/documents",
    action: "generate-document",
    order: 4,
  },
  {
    id: "complete-first-requirement",
    title: "Complete your first requirement",
    description: "Mark a compliance requirement as done",
    icon: "✅",
    href: "/requirements",
    action: "complete-requirement",
    order: 5,
  },
];

export const getInitialTasks = (hasCompletedAssessment: boolean, hasAccount: boolean): GettingStartedTask[] => {
  return DEFAULT_GETTING_STARTED_TASKS.map((task) => ({
    ...task,
    isCompleted: 
      (task.id === "complete-assessment" && hasCompletedAssessment) ||
      (task.id === "create-account" && hasAccount),
    completedAt: 
      (task.id === "complete-assessment" && hasCompletedAssessment) ||
      (task.id === "create-account" && hasAccount)
        ? new Date().toISOString()
        : undefined,
  }));
};

export const calculateTaskProgress = (tasks: GettingStartedTask[]): { completed: number; total: number; percentage: number } => {
  const completed = tasks.filter((t) => t.isCompleted).length;
  const total = tasks.length;
  const percentage = Math.round((completed / total) * 100);
  return { completed, total, percentage };
};
