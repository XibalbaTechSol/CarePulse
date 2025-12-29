import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options?: { value: string; label: string }[];
}

// Simple native select wrapper for now to ensure build passes
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, children, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-nord3 dark:text-nord4 mb-2 block">
                        {label}
                    </label>
                )}
                <select
                    className={cn(
                        "flex h-10 w-full rounded-md border border-nord4 dark:border-nord2 bg-nord6 dark:bg-nord0 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-nord3/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nord8 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-nord1 dark:text-nord6",
                        error && "border-nord11",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-nord11 mt-1">{error}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";
