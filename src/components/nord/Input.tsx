import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    success?: boolean;
}

/**
 * Nord-themed Input Component
 * 
 * @example
 * <Input label="Email" type="email" placeholder="Enter your email" />
 * <Input label="Username" error="Username is required" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helper, success, className, ...props }, ref) => {
        return (
            <div className="form-group">
                {label && (
                    <label className="input-label" htmlFor={props.id}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'input',
                        error && 'input-error',
                        success && 'input-success',
                        className
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error ? `${props.id}-error` : helper ? `${props.id}-helper` : undefined
                    }
                    {...props}
                />
                {error && (
                    <p className="input-error-text" id={`${props.id}-error`}>
                        {error}
                    </p>
                )}
                {!error && helper && (
                    <p className="input-helper" id={`${props.id}-helper`}>
                        {helper}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
