import { Department } from './types';

export const departmentColors: Record<Department, { bg: string; text: string }> = {
  Sales: { bg: 'bg-sales-bg', text: 'text-sales-text' },
  Operations: { bg: 'bg-operations-bg', text: 'text-operations-text' },
  HR: { bg: 'bg-hr-bg', text: 'text-hr-text' },
  'Customer Service': { bg: 'bg-customer-service-bg', text: 'text-customer-service-text' },
  Finance: { bg: 'bg-finance-bg', text: 'text-finance-text' },
  Marketing: { bg: 'bg-marketing-bg', text: 'text-marketing-text' },
};

export const departmentColorsHex: Record<Department, { bg: string; text: string }> = {
  Sales: { bg: '#E6F1FB', text: '#0C447C' },
  Operations: { bg: '#EEEDFE', text: '#3C3489' },
  HR: { bg: '#E1F5EE', text: '#085041' },
  'Customer Service': { bg: '#EAF3DE', text: '#27500A' },
  Finance: { bg: '#FAEEDA', text: '#633806' },
  Marketing: { bg: '#FAECE7', text: '#712B13' },
};

export function getDepartmentClasses(department: Department): string {
  const colors = departmentColors[department];
  return `${colors.bg} ${colors.text}`;
}

export function getDepartmentBgClass(department: Department): string {
  return departmentColors[department].bg;
}

export function getDepartmentTextClass(department: Department): string {
  return departmentColors[department].text;
}

export function getEffortLabel(effort: 'low' | 'medium' | 'high'): string {
  const labels = {
    low: 'Χαμηλό',
    medium: 'Μεσαίο',
    high: 'Υψηλό',
  };
  return labels[effort];
}
