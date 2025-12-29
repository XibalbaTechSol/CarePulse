import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error' | 'warning';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

/**
 * Nord-themed Button Component
 * 
 * @example
 * <Button variant="primary">Click Me</Button>
 * <Button variant="outline" size="sm">Small Button</Button>
 */
export function Button({
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'btn';

    const variantStyles = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'btn-ghost',
        success: 'btn-success',
        error: 'btn-error',
        warning: 'btn-warning',
    };

    const sizeStyles = {
        sm: 'btn-sm',
        md: '',
        lg: 'btn-lg',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
