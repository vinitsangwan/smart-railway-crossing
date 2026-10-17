/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        railway: {
          dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
          darker: 'rgb(var(--color-bg-darker) / <alpha-value>)',
          card: 'rgb(var(--color-bg-card) / <alpha-value>)',
          panel: 'rgb(var(--color-bg-panel) / <alpha-value>)',
          border: 'rgb(var(--color-border) / <alpha-value>)',
          text: 'rgb(var(--color-text-main) / <alpha-value>)',
          yellow: '#f59e0b',
          amber: '#d97706',
          red: '#dc2626',
          crimson: '#b91c1c',
          green: '#10b981',
          emerald: '#059669',
          slate: 'rgb(var(--color-slate) / <alpha-value>)',
          muted: 'rgb(var(--color-muted) / <alpha-value>)'
        },
        obsidian: {
          950: '#111113',
          900: '#16161a',
          850: '#19191e',
          800: '#1c1c21',
          700: '#24242b',
          600: '#31313a',
          500: '#484854',
          muted: '#8a8780',
          text: '#f4f3f0'
        },
        cream: {
          50: '#fcfbf8',
          100: '#f7f6f2',
          200: '#f1eee7',
          300: '#e2ddd3',
          400: '#cfc9bd',
          stone: '#57534e',
          text: '#1c1917'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-red': 'flashRed 0.8s ease-in-out infinite alternate',
      },
      keyframes: {
        flashRed: {
          '0%': { opacity: '0.35', filter: 'drop-shadow(0 0 1px rgba(220, 38, 38, 0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 4px rgba(220, 38, 38, 0.6))' },
        }
      }
    },
  },
  plugins: [],
}
