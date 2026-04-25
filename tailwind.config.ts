import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Liberators AI brand colors
        primary: '#007BFF', // Liberators blue
        'primary-hover': '#0066DD',
        'primary-light': '#E6F2FF',

        // Backgrounds - clean modern
        'bg-main': '#FAFAFA',
        'bg-card': '#FFFFFF',
        'bg-elevated': '#F5F5F5',
        'bg-accent': '#F0F7FF',

        // Text - neutral
        'text-main': '#1A1A1A',
        'text-secondary': '#4A4A4A',
        'text-muted': '#8A8A8A',

        // Borders - neutral gray
        'border-light': '#E5E5E5',
        'border-medium': '#D0D0D0',

        // Department colors
        'sales-bg': '#E6F2FF',
        'operations-bg': '#EEF0FF',
        'hr-bg': '#E6F5F0',
        'customer-service-bg': '#E8F5E6',
        'finance-bg': '#FFF8E6',
        'marketing-bg': '#FFE6F0',

        // Department colors - text
        'sales-text': '#0055CC',
        'operations-text': '#4040CC',
        'hr-text': '#008060',
        'customer-service-text': '#2D8020',
        'finance-text': '#CC8800',
        'marketing-text': '#CC2266',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

export default config
