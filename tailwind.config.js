 /** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'], // Adjust paths as necessary
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color)',
        secondary: 'var(--secondary-bg-color)',
        text: 'var(--text-color)',
        'text-hover': 'var(--text-hover-color)',
        'text-black' : 'var(--text-black)',


        button: 'var(--button-bg-color)',
        'button-hover': 'var(--button-hover-bg-color)',
        'button-text' : 'var(--button-text-color)',

        container: 'var(--container-bg-color)',
        link: 'var(--link-color)',
        'link-hover': 'var(--link-hover-color)',
        border: 'var(--border-color)',
        error: {
          bg: 'var(--error-bg-color)',
          text: 'var(--error-text-color)',
        },
        success: {
          bg: 'var(--success-bg-color)',
          text: 'var(--success-text-color)',
        },
        warning: {
          bg: 'var(--warning-bg-color)',
          text: 'var(--warning-text-color)',
        },
        info: {
          bg: 'var(--info-bg-color)',
          text: 'var(--info-text-color)',
        },
      },
    },
  },
  plugins: [],
};
