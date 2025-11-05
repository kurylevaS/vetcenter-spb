import { cva } from 'class-variance-authority';

export const cvaButton = cva(
  [
    'ButtonStyles-cvaButton',
    'relative',
    'inline-flex items-center justify-center',
    'group/button cursor-pointer select-none disabled:cursor-not-allowed',
    'transition-all duration-300',
  ],
  {
    variants: {
      theme: {
        green: 'bg-cGreen hover:bg-cGreen/80  text-white',
        white: 'bg-white hover:bg-white/80 text-cGreen',
      },
      rounded:{
        full: 'rounded-full',
        none: 'rounded-none',
        small: 'rounded-sm',
        medium: 'rounded-md',
        large: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        '4xl': 'rounded-4xl',
        '5xl': 'rounded-5xl',
      },
      size: {
        sm: 'text-sm py-1 px-4',
        md: 'text-base py-2 px-6',
        lg: 'text-lg py-3 px-8',
        xl: 'text-xl py-4 px-10',
        '2xl': 'text-2xl py-5 px-12',
        '3xl': 'text-3xl py-6 px-14',
        '4xl': 'text-4xl py-7 px-16',
        '5xl': 'text-5xl py-8 px-20',
        '6xl': 'text-6xl py-9 px-24',
        '7xl': 'text-7xl py-10 px-28',
        '8xl': 'text-8xl py-12 px-32',
        '9xl': 'text-9xl py-14 px-36',
        '10xl': 'text-10xl py-16 px-40',
      },
      isLoading: {
        true: ['!text-opacity-0'],
        false: [],
      },
    },
    defaultVariants: {
      theme: 'green',
      size: 'md',
      rounded: 'full',
    },
  }
);

export const cvaIcon = cva(
  [
    'ButtonStyles-cvaIcon',
    'inline-flex justify-center items-center',
    'text-0',
    'rounded-full',
  ],
  {
    variants: {
      theme: {},
      size: {},
      isLoading: {},
    },
    defaultVariants: {},
  }
);

export const cvaButtonInner = cva(
  ['ButtonStyles-cvaButtonInner', 'block overflow-hidden'],
  {
    variants: {
      size: {},
    },
  }
);

export const cvaButtonInnerRow = cva([
  'ButtonStyles-cvaButtonInnerRow',
  'relative',
  'block',
]);
