/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        erp: {
          bg: "rgb(var(--erp-bg) / <alpha-value>)",
          sidebar: "rgb(var(--erp-sidebar) / <alpha-value>)",
          sidebarHover: "rgb(var(--erp-sidebar-hover) / <alpha-value>)",
          sidebarText: "rgb(var(--erp-sidebar-text) / <alpha-value>)",
          sidebarMuted: "rgb(var(--erp-sidebar-muted) / <alpha-value>)",
          card: "rgb(var(--erp-card) / <alpha-value>)",
          cardHover: "rgb(var(--erp-card-hover) / <alpha-value>)",
          border: "rgb(var(--erp-border) / <alpha-value>)",
          accent: "rgb(var(--erp-accent) / <alpha-value>)",
          accentSecondary: "rgb(var(--erp-accent-secondary) / <alpha-value>)",
          "accent-dim": "rgb(var(--erp-accent) / 0.1)",
          success: "rgb(var(--erp-success) / <alpha-value>)",
          warning: "rgb(var(--erp-warning) / <alpha-value>)",
          danger: "rgb(var(--erp-danger) / <alpha-value>)",
          text: "rgb(var(--erp-text) / <alpha-value>)",
          muted: "rgb(var(--erp-muted) / <alpha-value>)",
          onAccent: "rgb(var(--erp-on-accent) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Clash Display"', "system-ui", "sans-serif"],
        sans: ['"General Sans"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        erp: "16px",
        "erp-lg": "20px",
        "erp-xl": "24px",
      },
      boxShadow: {
        "erp-card": "var(--erp-shadow-card)",
        "erp-glow": "var(--erp-shadow-glow)",
        "erp-hover": "var(--erp-shadow-hover)",
        "erp-sidebar": "4px 0 24px rgba(15, 23, 42, 0.15)",
      },
      backgroundImage: {
        "erp-gradient":
          "linear-gradient(135deg, rgb(var(--erp-accent) / 0.12) 0%, rgb(var(--erp-card)) 50%, rgb(var(--erp-accent-secondary) / 0.06) 100%)",
        "erp-accent-bar":
          "linear-gradient(90deg, rgb(var(--erp-accent)), rgb(var(--erp-accent-secondary)))",
        "erp-sidebar": "linear-gradient(180deg, rgb(17 24 39) 0%, rgb(17 24 39) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
