'use client';
import type { VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import Link from 'next/link';
import { FC, ReactNode } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {
  cvaButton,
  cvaButtonInner,
  cvaButtonInnerRow,
  cvaIcon,
} from './ButtonStyles';

interface Props
  extends VariantProps<typeof cvaButton>,
    VariantProps<typeof cvaButtonInnerRow> {
  href?: string;
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onlyIcon?: boolean;
  className?: string;
  innerRef?: any;
  dataCursor?: string;
  target?: string;
  isLoading?: boolean;
  hoverTextAnimation?: boolean;
  customIcon?: () => ReactNode;
}

const Button: FC<Props> = ({
  href = '',
  innerRef,
  children,
  onClick,
  icon,
  disabled,
  type,
  onlyIcon,
  className,
  dataCursor,
  isLoading,
  target,
  customIcon,
  theme,
  size,
  rounded,
}) => {
  return href ? (
    <Link
      target={target}
      rel={'noreferrer nofollower'}
      scroll={false}
      ref={innerRef}
      href={href}
      onClick={() => onClick?.()}
      className={clsx(
        cvaButton({
          isLoading,
          theme,
          size,
          rounded,
        }),
        className
      )}
      data-cursor={dataCursor}>
      {onlyIcon ? (
        <>
          {icon ? <div className={cvaIcon()}>{icon}</div> : null}{' '}
          {customIcon ? customIcon() : null} {children}
        </>
      ) : (
        <>
          {icon || customIcon ? (
            <>
              {icon ? (
                <div className={cvaIcon()}>{icon}</div>
              ) : customIcon ? (
                customIcon()
              ) : null}
            </>
          ) : null}
          <span className={cvaButtonInner()}>
            <span className={cvaButtonInnerRow({})}>
              {customIcon ? customIcon() : null} {children}
            </span>
            {isLoading ? <LoadingSpinner size={'sm'} color={'black'} /> : null}
          </span>
        </>
      )}
    </Link>
  ) : (
    <button
      ref={innerRef}
      disabled={disabled}
      type={type ?? 'button'}
      onClick={() => onClick?.()}
      className={clsx(
        cvaButton({
          isLoading,
          theme,
          size,
          rounded,
        }),
        className
      )}
      data-cursor={dataCursor}>
      {onlyIcon ? (
        <>
          {icon ? (
            <div className={cvaIcon()}>{icon}</div>
          ) : customIcon ? (
            customIcon()
          ) : null}
        </>
      ) : (
        <>
          {icon || customIcon ? (
            <>
              {icon ? <div className={cvaIcon()}>{icon}</div> : null}{' '}
              {customIcon ? customIcon() : null} {children}
            </>
          ) : null}
          <span className={cvaButtonInner()}>
            <span className={cvaButtonInnerRow({})}>
              {customIcon ? customIcon() : null} {children}
            </span>
            {isLoading ? <LoadingSpinner size={'sm'} color={'black'} /> : null}
          </span>
        </>
      )}
    </button>
  );
};

export default Button;
