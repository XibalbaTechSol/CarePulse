'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, User, Sparkles } from 'lucide-react';
import AudioPulse from './AudioPulse';

export default function ChatInterface() {
    const { messages, append, isLoading } = useChat() as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const [input, setInput] = useState('');
    const [volume, setVolume] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        await append({ role: 'user', content: input });
        setInput('');
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Mock volume effect when loading
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setVolume(Math.random() * 0.15 + 0.05); // Subtle oscillation
            }, 150);
        } else {
            setVolume(0);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLoading]);

    return (
        <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto glass overflow-hidden border border-[var(--glass-border)]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)] flex items-center gap-2">
                <Sparkles className="text-[var(--accent)]" size={20} />
                <h2 className="font-semibold text-lg">AI Assistant</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-[var(--text-muted)] mt-10 flex flex-col items-center">
                        <div className="mb-4 opacity-50">
                            <AudioPulse active={false} volume={0} hover={true} />
                        </div>
                        <p className="text-lg">How can I help you today?</p>
                        <p className="text-sm opacity-75">Ask me about your leads, deals, or schedule.</p>
                    </div>
                )}

                {messages.map((m: { id: string, role: string, content: string }) => (
                    <div
                        key={m.id}
                        className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {m.role !== 'user' && (
                            <div className="w-8 h-8 rounded-full bg-[rgba(6,182,212,0.1)] flex items-center justify-center shrink-0">
                                <AudioPulse active={false} volume={0} />
                            </div>
                        )}

                        <div
                            className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user'
                                ? 'bg-[var(--accent)] text-white rounded-br-none'
                                : 'bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-bl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{m.content}</p>
                        </div>

                        {
                            m.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center shrink-0">
                                    <User size={16} className="text-[var(--text-main)]" />
                                </div>
                            )
                        }
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-[rgba(6,182,212,0.1)] flex items-center justify-center shrink-0">
                            <AudioPulse active={true} volume={volume} />
                        </div>
                        <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-2xl rounded-bl-none p-3 flex items-center gap-1">
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[var(--glass-border)] bg-[rgba(255,255,255,0.03)]">
                <div className="relative flex items-center">
                    <input
                        className="w-full bg-[rgba(0,0,0,0.2)] text-[var(--text-main)] placeholder-[var(--text-muted)] border border-[var(--glass-border)] rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
