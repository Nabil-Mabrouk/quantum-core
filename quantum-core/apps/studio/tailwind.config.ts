import type { Config } from "tailwindcss";

const config: Config = {
  // 1. Chemins à scanner pour les classes CSS
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    // Si vous utilisez des composants depuis le dossier packages/ui
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // Configuration des animations utilisées dans vos modales et consoles
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },

  // 2. LA SAFELIST (CRUCIAL pour Quantum Core)
  // On force Tailwind à générer les variantes de couleurs pour tous vos domaines
  safelist: [
    {
      pattern: /^(bg|text|border|ring)-(blue|purple|emerald|orange|slate|red|amber)-(50|100|200|300|400|500|600|700|800|900)$/,
      variants: ['hover', 'group-hover', 'focus', 'active'],
    },
    {
      pattern: /^ring-(blue|purple|emerald|orange|slate|red|amber)-500\/20$/, // Pour les effets focus-ring
    },
    // Classes spécifiques pour les animations Tailwind-animate
    'animate-in',
    'fade-in',
    'zoom-in-95',
    'slide-in-from-top-2',
    'slide-in-from-bottom-10',
    'duration-200',
    'duration-300',
    'duration-500',
    'duration-700',
    'duration-1000'
  ],

  plugins: [
    require("@tailwindcss/typography"), // Pour le MarkdownViewer
    require("tailwindcss-animate"),      // Pour les animations fluides (facultatif si vous gérez à la main)
  ],
};

export default config;