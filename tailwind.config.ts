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
        // Brand colors
        primary: '#007BFF',
        'text-main': '#1a1a1a',
        'text-muted': '#666666',
        'border-light': '#E5E7EB',

        // Department colors - backgrounds
        'sales-bg': '#E6F1FB',
        'operations-bg': '#EEEDFE',
        'hr-bg': '#E1F5EE',
        'customer-service-bg': '#EAF3DE',
        'finance-bg': '#FAEEDA',
        'marketing-bg': '#FAECE7',

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
    },
  },
  plugins: [],
}

export default config
