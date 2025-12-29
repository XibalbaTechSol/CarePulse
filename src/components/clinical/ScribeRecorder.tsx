
'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Square, Sparkles, Loader2, Save, X, ClipboardCheck } from 'lucide-react';
import { generateScribeNote } from '@/lib/actions';

interface ScribeRecorderProps {
    onNoteGenerated?: (note: any) => void;
}

export default function ScribeRecorder({ onNoteGenerated }: ScribeRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [generatedNote, setGeneratedNote] = useState<any | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleStart = () => {
        setIsRecording(true);
        setRecordingTime(0);
        setTranscript('');
        setGeneratedNote(null);
    };

    const handleStop = async () => {
        setIsRecording(false);
        setIsProcessing(true);

        // Simulated transcript for the prototype
        // In reality, this would use Web Speech API or send audio to a Whisper endpoint
        const mockTranscript = "Patient John Doe presents today with a persistent cough for 3 days. He describes it as dry and worse at night. No fever, but some chest tightness. Examination shows clear lungs but slightly red throat. I'm recommending rest, hydration, and a course of Albuterol as needed for the tightness. We'll follow up in a week if it doesn't improve.";

        try {
            const note = await generateScribeNote(mockTranscript);
            setGeneratedNote(note);
            if (onNoteGenerated) onNoteGenerated(note);
        } catch (e) {
            console.error("Failed to scribe note", e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: isRecording ? 'rgba(239, 68, 68, 0.1)' : 'rgba(var(--primary-rgb), 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isRecording ? '#ef4444' : 'var(--primary)',
                        position: 'relative'
                    }}>
                        {isRecording ? <div className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', position: 'absolute', top: '8px', right: '8px' }} /> : null}
                        <Mic size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Ambient Scribe</h3>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Ready to record encounter'}
                        </p>
                    </div>
                </div>

                {!isRecording ? (
                    <button
                        onClick={handleStart}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px' }}
                        disabled={isProcessing}
                    >
                        <Mic size={16} /> Start Recording
                    </button>
                ) : (
                    <button
                        onClick={handleStop}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Square size={16} /> Finish & Process
                    </button>
                )}
            </div>

            {isProcessing && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem' }}>
                    <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontWeight: 'bold' }}>Generating Medical Note...</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Using Clinical NLP models to structure the encounter</p>
                    </div>
                </div>
            )}

            {generatedNote && (
                <div className="fade-in" style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                        <Sparkles size={16} /> AI GENERATED SOAP NOTE
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {['subjective', 'objective', 'assessment', 'plan'].map((section) => (
                            <div key={section} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                                    {section}
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                                    {generatedNote[section]}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Save size={16} /> Save to Patient Record
                        </button>
                        <button
                            onClick={() => setGeneratedNote(null)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <X size={16} /> Discard
                        </button>
                    </div>
                </div>
            )}

            {!isRecording && !isProcessing && !generatedNote && (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                    <ClipboardCheck size={32} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                        Ambiently capture patient encounters. The AI will automatically structure your conversation into a standard SOAP note.
                    </p>
                </div>
            )}
        </div>
    );
}
