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
        // Claude-inspired brand colors
        primary: '#D97757', // Claude terracotta/orange
        'primary-hover': '#C4684A',
        'primary-light': '#F5E6E0',

        // Backgrounds - warm cream tones
        'bg-main': '#FAF9F7',
        'bg-card': '#FFFFFF',
        'bg-elevated': '#F5F4F0',
        'bg-accent': '#FDF8F5',

        // Text - warm tones
        'text-main': '#1A1915',
        'text-secondary': '#5D5D5A',
        'text-muted': '#8B8B88',

        // Borders - warm gray
        'border-light': '#E8E6E1',
        'border-medium': '#D4D2CD',

        // Department colors - warmer palette
        'sales-bg': '#E8F0F5',
        'operations-bg': '#EEEDF8',
        'hr-bg': '#E5F2ED',
        'customer-service-bg': '#ECF2E5',
        'finance-bg': '#F8F0E3',
        'marketing-bg': '#F8EBE6',

        // Department colors - text
        'sales-text': '#0C447C',
        'operations-text': '#3C3489',
        'hr-text': '#085041',
        'customer-service-text': '#27500A',
        'finance-text': '#633806',
        'marketing-text': '#712B13',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 25, 21, 0.06)',
        'medium': '0 4px 16px rgba(26, 25, 21, 0.08)',
        'elevated': '0 8px 32px rgba(26, 25, 21, 0.12)',
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
