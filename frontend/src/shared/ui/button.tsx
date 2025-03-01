
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from 'shared/lib/utils';
import styles from './button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        styles[variant],
        styles[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';
