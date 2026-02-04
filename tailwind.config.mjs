/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',    // Blue
        secondary: '#f97316',  // Orange accent
        bglight: '#f8fafc',    // Light gray (cal.com style)
        card: '#ffffff',
      },
      fontFamily: {
        heading: ['Montserrat', 'Arial Black', 'sans-serif'],
        body: ['Trebuchet MS', 'Montserrat', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
