import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        shell: {
          bg: '#f4f5fb',
          panel: '#ffffff',
          panelSoft: '#fafbff',
          border: '#e7e9f2',
          text: '#17181c',
          muted: '#6b7280',
          accent: '#5f3df7',
          accentSoft: '#ede7ff',
          success: '#2fbf71',
          successSoft: '#d7f8e7',
          danger: '#ef6d6d',
          dangerSoft: '#fde2e2',
        },
      },
      boxShadow: {
        card: '0 20px 50px rgba(18, 25, 38, 0.08)',
      },
      borderRadius: {
        xl2: '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
