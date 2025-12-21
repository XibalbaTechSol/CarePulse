import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import './audio-orb/index'; // Import to register the custom element

interface OrbWrapperProps {
    onAiText?: (text: string) => void;
    onUserText?: (text: string) => void;
    onRecordingChange?: (isRecording: boolean) => void;
    headless?: boolean;
}

export interface OrbRef {
    sendText: (text: string) => void;
    toggleRecording: () => void;
}

const OrbWrapper = forwardRef<OrbRef, OrbWrapperProps>(({ onAiText, onUserText, onRecordingChange, headless = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        sendText: (text: string) => {
            if (orbRef.current && orbRef.current.sendText) {
                orbRef.current.sendText(text);
            }
        },
        toggleRecording: () => {
            if (orbRef.current && orbRef.current.toggleRecording) {
                orbRef.current.toggleRecording();
            }
        }
    }));

    useEffect(() => {
        const orb = orbRef.current;
        if (!orb) return;

        const handleAiText = (e: CustomEvent) => {
            onAiText?.(e.detail.text);
        };

        const handleUserText = (e: CustomEvent) => {
            onUserText?.(e.detail.text);
        };

        const handleRecordingChange = (e: CustomEvent) => {
            onRecordingChange?.(e.detail.isRecording);
        };

        orb.addEventListener('ai-text', handleAiText as EventListener);
        orb.addEventListener('user-text', handleUserText as EventListener);
        orb.addEventListener('recording-changed', handleRecordingChange as EventListener);

        return () => {
            orb.removeEventListener('ai-text', handleAiText as EventListener);
            orb.removeEventListener('user-text', handleUserText as EventListener);
            orb.removeEventListener('recording-changed', handleRecordingChange as EventListener);
        };
    }, [onAiText, onUserText, onRecordingChange]);

    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden" ref={containerRef}>
            {/* @ts-ignore */}
            <gdm-live-audio ref={orbRef} class="w-full h-full absolute inset-0" headless={headless}></gdm-live-audio>
        </div>
    );
});

export default OrbWrapper;
