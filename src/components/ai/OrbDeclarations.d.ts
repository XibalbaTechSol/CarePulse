import React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'gdm-live-audio': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                class?: string;
                headless?: boolean;
                ref?: React.Ref<any>;
            };
        }
    }
}