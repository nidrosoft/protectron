export type WalkthroughStatus = "not_started" | "in_progress" | "completed" | "skipped";

export interface WalkthroughProgress {
  id: string;
  userId: string;
  status: WalkthroughStatus;
  currentStep: number;
  stepsCompleted: number[];
  skippedAtStep?: number;
  firstAiSystemCreated?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalkthroughStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  targetSelector?: string;
  targetPage?: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  actionType?: "navigate" | "click" | "form" | "view";
  actionTarget?: string;
  highlights?: string[];
  tips?: string[];
  dynamicContent?: boolean;
}

export interface AssessmentContext {
  companyName?: string;
  industry?: string;
  totalSystems: number;
  highRiskCount: number;
  limitedRiskCount: number;
  minimalRiskCount: number;
  totalRequirements: number;
  daysUntilDeadline: number;
  detectedSystems?: {
    name: string;
    riskLevel: string;
    category: string;
  }[];
}

export interface GettingStartedTask {
  id: string;
  title: string;
  description: string;
  icon: string;
  href?: string;
  action?: string;
  isCompleted: boolean;
  completedAt?: string;
  order: number;
}

export interface WalkthroughState {
  isActive: boolean;
  status: WalkthroughStatus;
  currentStep: number;
  totalSteps: number;
  stepsCompleted: number[];
  assessmentContext: AssessmentContext | null;
  gettingStartedTasks: GettingStartedTask[];
  showWelcomeModal: boolean;
  showResumeModal: boolean;
}

export interface WalkthroughActions {
  startWalkthrough: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  skipWalkthrough: () => void;
  completeWalkthrough: () => void;
  resetWalkthrough: () => void;
  dismissWelcomeModal: () => void;
  dismissResumeModal: () => void;
  completeTask: (taskId: string) => void;
  refreshProgress: () => Promise<void>;
}

export type WalkthroughContextType = WalkthroughState & WalkthroughActions;
