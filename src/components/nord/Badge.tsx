import React from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';

export interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

/**
 * Nord-themed Badge Component
 * 
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error">Failed</Badge>
 */
export function Badge({ children, variant = 'primary', className }: BadgeProps) {
    const variantStyles = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
    };

    return (
        <span className={cn('badge', variantStyles[variant], className)}>
            {children}
        </span>
    );
}
