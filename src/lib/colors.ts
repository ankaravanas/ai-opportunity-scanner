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
    low: 'Χαμηλή',
    medium: 'Μέτρια',
    high: 'Υψηλή',
  };
  return labels[effort];
}

// Department icon SVG paths
export const departmentIconPaths: Record<Department, string[]> = {
  Sales: ['M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'],
  Operations: [
    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  ],
  HR: [
    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  ],
  'Customer Service': [
    'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  ],
  Finance: [
    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  ],
  Marketing: [
    'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  ],
};
