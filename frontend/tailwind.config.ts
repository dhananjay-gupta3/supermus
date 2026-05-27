import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 0 1px rgba(148,163,184,0.12), 0 20px 50px rgba(15,23,42,0.2)'
      },
      colors: {
        surface: '#0f172a',
        surface2: '#111827',
        border: '#334155'
      }
    }
  },
  plugins: []
};

export default config;
