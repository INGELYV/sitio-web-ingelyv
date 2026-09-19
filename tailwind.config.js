/** Configuración compilada (reemplaza el tailwind.config inline del Play CDN).
 *  Los colores se resuelven con variables CSS definidas en css/styles.css, para que
 *  contacto.html (.dark-page) pueda usar su propia paleta sin cambiar el HTML. */
const withVar = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ['./*.html', './js/**/*.js'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: withVar('--c-primary'),
        'primary-light': withVar('--c-primary-light'),
        'accent-orange': withVar('--c-accent-orange'),
        'accent-orange-hover': withVar('--c-accent-orange-hover'),
        // Naranjo más profundo: acentos de contacto, enlace activo y foco de formularios
        'accent-orange-deep': withVar('--c-accent-orange-deep'),
        'cement-gray': withVar('--c-cement-gray'),
        'background-light': withVar('--c-background-light'),
        'background-dark': withVar('--c-background-dark'),
        surface: withVar('--c-surface'),
        'surface-dark': withVar('--c-surface-dark'),
        'border-dark': withVar('--c-border-dark'),
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        sm: '0.125rem',
        md: '0.25rem',
        lg: '0.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
