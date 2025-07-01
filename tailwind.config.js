// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Observa todos os arquivos dentro de src
  ],
  darkMode: 'class', // Habilita o modo escuro baseado em classe no HTML
  theme: {
    extend: {
      boxShadow: { // Adicionando sombras customizadas para o Neumorfismo
        'neumorphic-light': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neumorphic-dark': '5px 5px 10px #1a1a1a, -5px -5px 10px #2c2c2c',
      }
    },
  },
  plugins: [],
}