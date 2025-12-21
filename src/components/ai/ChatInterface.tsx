'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import OrbWrapper, { OrbRef } from './OrbWrapper';

interface Message {
    role: 'ai' | 'user';
    text: string;
}

export default function ChatInterface() {
    const [transcript, setTranscript] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const orbRef = useRef<OrbRef>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [transcript]);

    const handleAiText = (text: string) => {
        setTranscript(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'ai') {
                return [...prev.slice(0, -1), { ...last, text: last.text + text }];
            }
            return [...prev, { role: 'ai', text }];
        });
    };

    const handleUserText = (text: string) => {
        setTranscript(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'user') {
                return [...prev.slice(0, -1), { ...last, text: text }]; // Update if it's streaming? Usually user text is final block
            }
            return [...prev, { role: 'user', text }];
        });
    };

    const handleSendMessage = () => {
        if (!inputText.trim()) return;
        
        // Add to transcript immediately for better UX
        setTranscript(prev => [...prev, { role: 'user', text: inputText }]);
        
        // Send to AI
        orbRef.current?.sendText(inputText);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const toggleRecording = () => {
        orbRef.current?.toggleRecording();
    };

    return (
        <div className="h-[calc(100vh-140px)] w-full overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl flex flex-col">
            
            {/* Top 2/3: Background Orb */}
            <div className="h-[66%] w-full relative z-0">
                <OrbWrapper 
                    ref={orbRef}
                    onAiText={handleAiText} 
                    onUserText={handleUserText} 
                    onRecordingChange={setIsRecording}
                    headless={true}
                />
            </div>

            {/* Bottom 1/3: Chat Interface */}
            <div className="h-[34%] w-full flex flex-col bg-black/40 border-t border-white/10 z-10">
                
                {/* Chat History - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {transcript.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-50 text-white/50 animate-pulse">
                            <p className="text-sm font-light">How can I help you today?</p>
                        </div>
                    )}
                    
                    {transcript.map((msg, idx) => (
                        <div 
                            key={idx} 
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div 
                                className={`
                                    max-w-[90%] rounded-xl px-4 py-2 text-sm backdrop-blur-sm shadow-sm
                                    ${msg.role === 'user' 
                                        ? 'bg-primary/10 text-white border border-primary/20 rounded-br-none' 
                                        : 'bg-white/5 text-cyan-50 border border-white/10 rounded-bl-none'
                                    }
                                `}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed at Bottom */}
                <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/5">
                    <div className="max-w-4xl mx-auto flex items-end gap-3 p-1 rounded-xl">
                        
                        <button
                            onClick={toggleRecording}
                            className={`
                                p-3 rounded-lg transition-all duration-300 flex items-center justify-center shrink-0
                                ${isRecording 
                                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 animate-pulse border border-red-500/50' 
                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10'
                                }
                            `}
                            title={isRecording ? "Stop Listening" : "Start Listening"}
                        >
                            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>

                        <div className="flex-1 relative">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message..."
                                className="w-full bg-white/5 text-white placeholder-gray-500 text-sm p-3 rounded-lg border border-white/10 focus:border-primary/50 focus:bg-white/10 max-h-[100px] resize-none focus:outline-none scrollbar-hide transition-all"
                                rows={1}
                                style={{ minHeight: '46px' }}
                            />
                        </div>

                        <button
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className={`
                                p-3 rounded-lg transition-all duration-200 shrink-0
                                ${inputText.trim() 
                                    ? 'bg-primary text-black hover:bg-primary-light hover:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]' 
                                    : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/10'
                                }
                            `}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}