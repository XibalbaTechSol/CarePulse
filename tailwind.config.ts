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
                background: "var(--background)",
                surface: "var(--surface)",
                "surface-highlight": "var(--surface-highlight)",
                border: "var(--border)",
                primary: "var(--primary)",
                "primary-hover": "var(--primary-hover)",
                "primary-subtle": "var(--primary-subtle)",
                "primary-ring": "var(--primary-ring)",
                "text-primary": "var(--text-primary)",
                "text-secondary": "var(--text-secondary)",
                "text-tertiary": "var(--text-tertiary)",
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
                // legacy mapping for backward compat if needed during refactor
                "background-dark": "var(--background)",
                "surface-dark": "var(--surface)",
                "border-dark": "var(--border)",
                "text-muted": "var(--text-secondary)",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
