'use client';

import React, { useState } from 'react';
import { Terminal, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { Card, Alert } from '@/components/nord';

export default function CLIPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        setHasError(false);
        const iframe = document.getElementById('cli-iframe') as HTMLIFrameElement;
        if (iframe) {
            iframe.src = iframe.src;
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:px-8 md:py-6 border-b border-border/50 bg-surface/30">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Terminal className="text-primary" size={20} />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-primary">
                            CLI Terminal
                        </h1>
                        <p className="text-text-secondary text-sm">
                            CarePulse Medical AI - Powered by TOAD Framework
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-highlight hover:bg-surface-hover text-text-primary transition-colors border border-border/50"
                        title="Refresh Terminal"
                    >
                        <RefreshCw size={16} />
                        <span className="hidden md:inline">Refresh</span>
                    </button>
                    <a
                        href="http://localhost:8000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/30"
                        title="Open in New Tab"
                    >
                        <ExternalLink size={16} />
                        <span className="hidden md:inline">New Tab</span>
                    </a>
                </div>
            </div>

            {/* Error Alert */}
            {hasError && (
                <div className="p-4 md:px-8">
                    <Alert variant="error">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="shrink-0 mt-0.5" size={20} />
                            <div>
                                <h3 className="font-semibold mb-1">Failed to load CLI Terminal</h3>
                                <p className="text-sm opacity-90 mb-3">
                                    The TOAD webserver may not be running on port 8000.
                                </p>
                                <div className="text-sm space-y-1">
                                    <p>To start the webserver, run:</p>
                                    <code className="block bg-nord0 dark:bg-nord1 p-2 rounded font-mono text-xs mt-2">
                                        cd toad && python3 -m toad.cli serve --port 8000
                                    </code>
                                </div>
                            </div>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && !hasError && (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-text-secondary">Loading CLI Terminal...</p>
                    </div>
                </div>
            )}

            {/* Terminal Iframe */}
            <div className="flex-1 relative overflow-hidden">
                <iframe
                    id="cli-iframe"
                    src="http://localhost:8000"
                    className={`absolute inset-0 w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                    onLoad={handleLoad}
                    onError={handleError}
                    title="CLI Terminal"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
            </div>
        </div>
    );
}
