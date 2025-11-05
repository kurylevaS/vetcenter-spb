'use client';
import { FC, ReactNode } from 'react';
import { Lenis as ReactLenis } from '@studio-freight/react-lenis';

const options = {};

interface Props {
  children: ReactNode;
}

const SmoothScroll: FC<Props> = ({ children }) => {
  return (
    <ReactLenis className={'lenis-container'} root options={{ ...options }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
