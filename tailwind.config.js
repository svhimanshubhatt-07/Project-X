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
        // Semantic background tokens linked to variables.css
        bg: {
          app: 'var(--bg-app)',
          surface: 'var(--bg-surface)',
          surfaceHover: 'var(--bg-surface-hover)',
          card: 'var(--bg-card)',
          cardHover: 'var(--bg-card-hover)',
          cardInner: 'var(--bg-card-inner)',
          sidebar: 'var(--bg-sidebar)',
          sidebarActive: 'var(--bg-sidebar-active)',
          header: 'var(--bg-header)',
          modal: 'var(--bg-modal)',
          modalHeader: 'var(--bg-modal-header)',
        },
        // Semantic border tokens linked to variables.css
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          card: 'var(--border-card)',
          divider: 'var(--border-divider)',
          accent: 'var(--border-accent)',
        },
        // Semantic brand & accent tokens linked to variables.css
        brand: {
          primary: 'var(--brand-primary)',
          primaryHover: 'var(--brand-primary-hover)',
          secondary: 'var(--brand-secondary)',
          secondaryHover: 'var(--brand-secondary-hover)',
          glow: 'var(--brand-glow)',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          DEFAULT: 'var(--brand-primary)',
          accent: 'var(--brand-secondary)',
        },
        // Semantic text tokens linked to variables.css
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        // Semantic status tokens linked to variables.css
        status: {
          success: 'var(--status-success)',
          warning: 'var(--status-warning)',
          danger: 'var(--status-danger)',
          info: 'var(--status-info)',
        },
        // Semantic table tokens linked to variables.css
        table: {
          bg: 'var(--bg-table)',
          header: 'var(--bg-table-header)',
          row: 'var(--bg-table-row)',
          rowHover: 'var(--bg-table-row-hover)',
          empty: 'var(--bg-table-empty)',
          border: 'var(--border-table)',
          headerBorder: 'var(--border-table-header)',
          rowBorder: 'var(--border-table-row)',
          headerText: 'var(--text-table-header)',
          text: 'var(--text-table-body)',
          muted: 'var(--text-table-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
}
