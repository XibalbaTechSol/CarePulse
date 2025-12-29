import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from '@/components/nord';
import { Mic, StopCircle, Sparkles, Loader2 } from 'lucide-react';
import { generateNoteFromTranscript } from '@/lib/actions/clinical/documentation';

interface AmbientScribeProps {
    onNoteGenerated?: (note: any) => void;
}

export function AmbientScribe({ onNoteGenerated }: AmbientScribeProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [generatedSummary, setGeneratedSummary] = useState<any>(null);
    const recognitionRef = useRef<any>(null); // Type check needed for window.SpeechRecognition

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore - SpeechRecognition is not standard in all browsers yet
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        }
                        // Interim transcript logic removed as unused
                    }

                    // Update transcript (basic appending for demo)
                    if (finalTranscript) {
                        setTranscript(prev => prev + ' ' + finalTranscript);
                    }
                };
            }
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleGenerateNote = async () => {
        if (!transcript.trim()) return;

        setIsProcessing(true);
        try {
            const result = await generateNoteFromTranscript(transcript);
            if (result.success && result.note) {
                setGeneratedSummary(result.note);
                if (onNoteGenerated) {
                    onNoteGenerated(result.note);
                }
            }
        } catch (error) {
            console.error("Failed to generate note", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Card className="h-full flex flex-col border-none shadow-none bg-transparent dark:bg-transparent">
            <Card.Header className="pb-2">
                <div className="text-lg flex items-center justify-between font-semibold text-nord0 dark:text-nord6">
                    <span className="flex items-center gap-2">
                        <Mic className={`w-5 h-5 ${isRecording ? 'text-nord11 animate-pulse' : 'text-nord3'}`} />
                        Ambient Scribe
                    </span>
                    {isRecording && <span className="text-xs text-nord11 font-mono animate-pulse">RECORDING</span>}
                </div>
            </Card.Header>
            <Card.Body className="flex-1 flex flex-col gap-4">
                <div className="bg-nord5 dark:bg-nord1/50 rounded-md p-4 flex-1 min-h-[200px] border border-nord4 dark:border-nord2 relative overflow-y-auto">
                    {transcript ? (
                        <div className="space-y-4">
                            {!generatedSummary ? (
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-nord1 dark:text-nord5">{transcript}</p>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="bg-nord14/10 border border-nord14/20 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-nord14 mb-1">
                                            <Sparkles size={14} />
                                            <span className="text-xs font-bold uppercase">Clinical Summary</span>
                                        </div>
                                        <p className="text-sm text-nord0 dark:text-nord6">{generatedSummary.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-nord10/10 border border-nord10/20 rounded-lg p-3">
                                            <span className="text-[10px] font-bold text-nord10 uppercase block mb-2">Coding Suggestions</span>
                                            <div className="space-y-1">
                                                {generatedSummary.codingSuggestions?.map((s: any, i: number) => (
                                                    <div key={i} className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-nord0 dark:text-nord6">{s.code}</span>
                                                        <span className="text-[10px] text-nord3 dark:text-nord4 line-clamp-1">{s.description}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-nord15/10 border border-nord15/20 rounded-lg p-3">
                                            <span className="text-[10px] font-bold text-nord15 uppercase block mb-2">Follow-up Tasks</span>
                                            <ul className="list-disc list-inside space-y-1">
                                                {generatedSummary.followUpTasks?.map((task: string, i: number) => (
                                                    <li key={i} className="text-[10px] text-nord1 dark:text-nord5 line-clamp-1">{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <Button variant="ghost" size="sm" onClick={() => setGeneratedSummary(null)} className="text-xs">
                                        Edit Transcript
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-nord3 dark:text-nord4 text-sm">
                            <p>Start recording to capture conversation...</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 justify-end">
                    <Button
                        variant={isRecording ? "secondary" : "primary"}
                        onClick={toggleRecording}
                        className={isRecording ? "text-nord11 hover:text-nord11" : ""}
                    >
                        {isRecording ? (
                            <>
                                <StopCircle className="w-4 h-4 mr-2" /> Stop Recording
                            </>
                        ) : (
                            <>
                                <Mic className="w-4 h-4 mr-2" /> Start Recording
                            </>
                        )}
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleGenerateNote}
                        disabled={!transcript || isProcessing}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" /> Generate Note
                            </>
                        )}
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
