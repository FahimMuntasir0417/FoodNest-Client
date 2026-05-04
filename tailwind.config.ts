// tailwind.config.ts
export default {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/lib/components/**/*.{ts,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
