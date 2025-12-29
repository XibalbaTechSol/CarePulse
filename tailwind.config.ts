import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Nord Palette (direct access if needed)
                nord0: "#2E3440",
                nord1: "#3B4252",
                nord2: "#434C5E",
                nord3: "#4C566A",
                nord4: "#D8DEE9",
                nord5: "#E5E9F0",
                nord6: "#ECEFF4",
                nord7: "#8FBCBB",
                nord8: "#88C0D0",
                nord9: "#81A1C1",
                nord10: "#5E81AC",
                nord11: "#BF616A",
                nord12: "#D08770",
                nord13: "#EBCB8B",
                nord14: "#A3BE8C",
                nord15: "#B48EAD",

                // Semantic mappings (referenced from CSS variables)
                background: "var(--background)",
                "background-elevated": "var(--background-elevated)",
                surface: "var(--surface)",
                "surface-highlight": "var(--surface-highlight)",
                "surface-hover": "var(--surface-hover)",

                border: "var(--border)",
                "border-subtle": "var(--border-subtle)",
                "border-focus": "var(--border-focus)",

                primary: "var(--primary)",
                "primary-hover": "var(--primary-hover)",
                "primary-active": "var(--primary-active)",
                "primary-subtle": "var(--primary-subtle)",
                "primary-ring": "var(--primary-ring)",

                secondary: "var(--secondary)",
                "secondary-hover": "var(--secondary-hover)",
                "secondary-active": "var(--secondary-active)",

                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-tertiary": "var(--text-tertiary)",
                "text-muted": "var(--text-muted)",
                "text-inverse": "var(--text-inverse)",

                success: "var(--success)",
                "success-bg": "var(--success-bg)",
                "success-border": "var(--success-border)",

                warning: "var(--warning)",
                "warning-bg": "var(--warning-bg)",
                "warning-border": "var(--warning-border)",

                error: "var(--error)",
                "error-bg": "var(--error-bg)",
                "error-border": "var(--error-border)",

                info: "var(--info)",
                "info-bg": "var(--info-bg)",
                "info-border": "var(--info-border)",

                caution: "var(--caution)",
                special: "var(--special)",

                // Legacy compatibility (will be removed in future versions)
                "background-dark": "var(--background)",
                "surface-dark": "var(--surface)",
                "border-dark": "var(--border)",
            },
            fontFamily: {
                sans: ["var(--font-sans)", "sans-serif"],
                mono: ["var(--font-mono)", "monospace"],
            },
            fontSize: {
                xs: "var(--text-xs)",
                sm: "var(--text-sm)",
                base: "var(--text-base)",
                lg: "var(--text-lg)",
                xl: "var(--text-xl)",
                "2xl": "var(--text-2xl)",
                "3xl": "var(--text-3xl)",
                "4xl": "var(--text-4xl)",
            },
            spacing: {
                xs: "var(--space-xs)",
                sm: "var(--space-sm)",
                md: "var(--space-md)",
                lg: "var(--space-lg)",
                xl: "var(--space-xl)",
                "2xl": "var(--space-2xl)",
                "3xl": "var(--space-3xl)",
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                xl: "var(--radius-xl)",
                "2xl": "var(--radius-2xl)",
                full: "var(--radius-full)",
            },
            boxShadow: {
                sm: "var(--shadow-sm)",
                md: "var(--shadow-md)",
                lg: "var(--shadow-lg)",
                xl: "var(--shadow-xl)",
                "2xl": "var(--shadow-2xl)",
                inner: "var(--shadow-inner)",
                "glow-primary": "var(--glow-primary)",
                "glow-success": "var(--glow-success)",
                "glow-error": "var(--glow-error)",
            },
            transitionDuration: {
                fast: "var(--transition-fast)",
                base: "var(--transition-base)",
                slow: "var(--transition-slow)",
            },
            zIndex: {
                dropdown: "var(--z-dropdown)",
                sticky: "var(--z-sticky)",
                fixed: "var(--z-fixed)",
                "modal-backdrop": "var(--z-modal-backdrop)",
                modal: "var(--z-modal)",
                popover: "var(--z-popover)",
                tooltip: "var(--z-tooltip)",
            },
        },
    },
    plugins: [],
};
export default config;

