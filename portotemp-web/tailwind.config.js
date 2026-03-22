/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        success: {
          50: '#f0fdf4', 100: '#dcfce7',
          500: '#22c55e', 600: '#16a34a', 700: '#15803d'
        },
        warning: {
          50: '#fffbeb', 100: '#fef3c7',
          400: '#fbbf24', 500: '#f59e0b', 600: '#d97706'
        },
        danger: {
          50: '#fef2f2', 100: '#fee2e2',
          400: '#f87171', 500: '#ef4444', 600: '#dc2626'
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        card2: '0 4px 12px 0 rgb(0 0 0 / 0.08)',
        modal: '0 24px 64px -12px rgb(0 0 0 / 0.18)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
      },
    },
  },
  plugins: [],
}
