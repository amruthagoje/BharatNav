/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#030810',
          900: '#07111F', // Deep Midnight Navy
          800: '#0D1B2E',
          700: '#162840',
          600: '#213754',
        },
        saffron: {
          DEFAULT: '#FF9933',
          light: '#FFB366',
          dark: '#E67E17',
        },
        cyan: {
          electric: '#00D9FF',
        },
        safety: {
          green: '#27E38A',
        },
        warning: {
          amber: '#FFC857',
        },
        danger: {
          red: '#FF4D5A',
        },
        muted: {
          blue: '#829AB1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-cyan': 'glowCyan 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glowCyan: {
          '0%': { boxShadow: '0 0 5px rgba(0, 217, 255, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 217, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
