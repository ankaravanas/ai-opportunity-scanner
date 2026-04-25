export type Department =
  | 'Sales'
  | 'Operations'
  | 'HR'
  | 'Customer Service'
  | 'Finance'
  | 'Marketing';

export type EffortLevel = 'low' | 'medium' | 'high';

export interface Opportunity {
  title: string;
  department: Department;
  description: string;
  time_savings_hours_week: number;
  effort: EffortLevel;
  timeline_weeks: number;
  impact_score: number; // 1-10
}

export interface AnalysisResult {
  company: string;
  industry: string;
  opportunities: Opportunity[];
  raw_summary?: string;
}

export type AppState = 'idle' | 'loading' | 'results' | 'emailSent';

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
}

export interface SendReportRequest {
  email: string;
}

export interface SendReportResponse {
  success: boolean;
  error?: string;
}

// Helper function to calculate annual savings
export function calculateAnnualSavings(hoursPerWeek: number, hourlyRate: number = 25): number {
  // 48 working weeks per year
  return Math.round(hoursPerWeek * 48 * hourlyRate);
}

// Format currency in euros
export function formatEuros(amount: number): string {
  if (amount >= 1000) {
    return `€${Math.round(amount / 1000)}K`;
  }
  return `€${amount}`;
}
