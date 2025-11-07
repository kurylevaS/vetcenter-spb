/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        cBlack: '#4C4C4C',
        cWhite: '#fff',
        cGreen: '#82A81D',
        // Цвета для баннера
        bannerGreen: '#8DC63F',
        bannerButtonGreen: '#8CBF40',
        bannerBg: '#F8FBF7',
        bannerTextGray: '#4A4A4A',
        bannerTextGrayLight: '#777777',
      },

      animation: {
        'spin-slow': 'spinSlow 5s linear infinite',
        'loading-spin': 'loadingSpin 2s ease infinite',
      },
      animationDelay: {
        'n1.5': '-1.5s',
        n1: '-1s',
        'n0.5': '-0.5s',
      },
    },

    fontFamily: {
      base: 'var(--base-font)',
      secondary: 'var(--secondary-font)',
      montserrat: 'Montserrat, sans-serif',
    },
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      169: '16 / 9',
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']),
        addVariant('inverted-colors', '@media (inverted-colors: inverted)'),
        addVariant('not-last', '&:not(:last-child)'),
        addVariant('not-first', '&:not(:first-child)'),
        addVariant('child-1', '&:nth-child(1)'),
        addVariant('child-2', '&:nth-child(2)'),
        addVariant('child-3', '&:nth-child(3)'),
        addVariant('child-4', '&:nth-child(4)'),
        addVariant('child-5', '&:nth-child(5)'),
        addVariant('child-6', '&:nth-child(6)'),
        addVariant('child-7', '&:nth-child(7)'),
        addVariant('child-8', '&:nth-child(8)'),
        addVariant('child-9', '&:nth-child(9)');
    }),
    require('tailwindcss-aspect-ratio'),
    require('tailwindcss-animation-delay'),
  ],
};
