import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';
import { Icon } from './Icon';

type Variant = 'primary' | 'outline' | 'ghost' | 'solid';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-full font-semibold ' +
  'whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-300 ' +
  'ease-[var(--ease-expo)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-55';

const variants: Record<Variant, string> = {
  // Gold fill — the one call to action per screen.
  primary:
    'bg-gold text-on-gold shadow-[0_10px_30px_-12px_var(--accent)] hover:bg-gold-hover ' +
    'hover:shadow-[0_16px_40px_-12px_var(--accent)] hover:-translate-y-0.5',
  outline:
    'border border-line-strong text-ink hover:border-gold hover:text-gold ' +
    'hover:-translate-y-0.5 hover:bg-gold/5',
  ghost: 'text-muted hover:text-gold hover:bg-gold/8',
  solid:
    'bg-surface-raised text-ink border border-line hover:border-gold/50 hover:-translate-y-0.5 ' +
    'shadow-[0_8px_24px_-16px_rgb(var(--shadow-color)/0.6)]',
};

const sizes: Record<Size, string> = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-7 text-[0.95rem]',
  lg: 'h-14 px-9 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  /** Icon rendered after the label; flips automatically in RTL. */
  trailingIcon?: string;
  leadingIcon?: string;
}

// Built on Framer's prop types rather than React's: `onAnimationStart` and
// friends mean different things to each, and mixing them breaks inference.
type ButtonProps = CommonProps & Omit<HTMLMotionProps<'button'>, 'children'> & { as?: 'button' };
type AnchorProps = CommonProps & Omit<HTMLMotionProps<'a'>, 'children'> & { as: 'a' };

function Inner({
  children,
  leadingIcon,
  trailingIcon,
}: Pick<CommonProps, 'children' | 'leadingIcon' | 'trailingIcon'>) {
  return (
    <>
      {leadingIcon && <Icon name={leadingIcon} className="size-[1.15em] shrink-0" />}
      <span>{children}</span>
      {trailingIcon && (
        <Icon
          name={trailingIcon}
          className="size-[1.15em] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        />
      )}
    </>
  );
}

export function Button(props: ButtonProps | AnchorProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    leadingIcon,
    trailingIcon,
    ...rest
  } = props;

  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.as === 'a') {
    const { as: _as, ...anchorProps } = rest as AnchorProps;
    return (
      <motion.a className={classes} whileTap={{ scale: 0.97 }} {...anchorProps}>
        <Inner leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
          {children}
        </Inner>
      </motion.a>
    );
  }

  const { as: _as, ...buttonProps } = rest as ButtonProps;
  return (
    <motion.button className={classes} whileTap={{ scale: 0.97 }} {...buttonProps}>
      <Inner leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </Inner>
    </motion.button>
  );
}
