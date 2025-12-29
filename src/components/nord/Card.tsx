import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    elevated?: boolean;
}

export interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

export interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Nord-themed Card Component
 * 
 * @example
 * <Card>
 *   <Card.Header>Title</Card.Header>
 *   <Card.Body>Content</Card.Body>
 *   <Card.Footer>Footer</Card.Footer>
 * </Card>
 */
export function Card({ children, className, hover = false, elevated = false, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'card',
                hover && 'card-hover',
                elevated && 'card-elevated',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

Card.Header = function CardHeader({ children, className }: CardHeaderProps) {
    return <div className={cn('card-header', className)}>{children}</div>;
};

Card.Body = function CardBody({ children, className }: CardBodyProps) {
    return <div className={cn('card-body', className)}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className }: CardFooterProps) {
    return <div className={cn('card-footer', className)}>{children}</div>;
};
