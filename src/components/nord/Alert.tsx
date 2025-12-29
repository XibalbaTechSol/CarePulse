import React from 'react';
import { cn } from '@/lib/utils';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
    children: React.ReactNode;
    variant?: AlertVariant;
    className?: string;
}

/**
 * Nord-themed Alert Component
 * 
 * @example
 * <Alert variant="success">Operation completed successfully!</Alert>
 * <Alert variant="error">An error occurred.</Alert>
 */
export function Alert({ children, variant = 'info', className }: AlertProps) {
    const variantStyles = {
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error',
        info: 'alert-info',
    };

    return (
        <div className={cn('alert', variantStyles[variant], className)} role="alert">
            {children}
        </div>
    );
}
