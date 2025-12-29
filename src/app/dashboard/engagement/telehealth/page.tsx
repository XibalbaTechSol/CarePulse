
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Video, Mic, MicOff, Camera, CameraOff, PhoneOff, User } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getUpcomingVisits, generateSessionToken } from '@/lib/actions/engagement/telehealth';

export default function TelehealthPage() {
    const [visits, setVisits] = useState<any[]>([]);
    const [activeCall, setActiveCall] = useState<any>(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    const loadData = async () => {
        const data = await getUpcomingVisits('mock-org');
        setVisits(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleJoin = async (visit: any) => {
        const session = await generateSessionToken(visit.id);
        setActiveCall({ ...visit, ...session });
    };

    const handleEndCall = () => {
        setActiveCall(null);
    };

    return (
        <ModuleLayout
            moduleName="Telehealth"
            moduleIcon={<Video className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Virtual Visits', href: '/dashboard/engagement/telehealth' }]}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Area */}
                <div className="lg:col-span-2">
                    <Card className="h-[500px] border-nord4 dark:border-nord2 overflow-hidden flex flex-col relative bg-nord0">
                        {activeCall ? (
                            <>
                                <div className="flex-1 relative">
                                    {/* Main Video (Patient) */}
                                    {/* In a real app, this would be the WebRTC video stream */}
                                    <div className="absolute inset-x-0 bottom-0 top-0 flex items-center justify-center bg-nord1">
                                        <User className="w-32 h-32 text-nord3 opacity-50" />
                                        <span className="absolute mt-40 text-nord4 text-lg">Connected to {activeCall.patient}</span>
                                    </div>

                                    {/* Self View (PIP) */}
                                    {camOn && (
                                        <div className="absolute bottom-4 right-4 w-40 h-28 bg-nord2 border border-nord3 rounded shadow-lg flex items-center justify-center">
                                            <span className="text-xs text-nord4">You</span>
                                        </div>
                                    )}

                                    {/* Status Indicators */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <Badge variant="error" className="animate-pulse">REC</Badge>
                                        <Badge variant="primary" className="bg-black/50 text-white border-0">00:12:45</Badge>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="h-20 bg-nord1 flex items-center justify-center gap-4 border-t border-nord2">
                                    <Button
                                        onClick={() => setMicOn(!micOn)}
                                        className={`rounded-full w-12 h-12 p-0 flex items-center justify-center ${micOn ? 'bg-nord3 hover:bg-nord4 text-nord0' : 'bg-nord11 hover:bg-red-600 text-white'}`}
                                    >
                                        {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                                    </Button>
                                    <Button
                                        onClick={() => setCamOn(!camOn)}
                                        className={`rounded-full w-12 h-12 p-0 flex items-center justify-center ${camOn ? 'bg-nord3 hover:bg-nord4 text-nord0' : 'bg-nord11 hover:bg-red-600 text-white'}`}
                                    >
                                        {camOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
                                    </Button>
                                    <Button
                                        onClick={handleEndCall}
                                        className="rounded-full w-16 h-12 bg-nord11 hover:bg-red-600 text-white flex items-center justify-center"
                                    >
                                        <PhoneOff className="w-6 h-6" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-nord4">
                                <Video className="w-16 h-16 mb-4 text-nord3" />
                                <h3 className="text-xl font-bold mb-2">No Active Call</h3>
                                <p className="text-nord3 max-w-xs text-center">Select a scheduled visit from the list to join the waiting room.</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar / Queue */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Upcoming Visits</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="space-y-3">
                                {visits.map(v => (
                                    <div key={v.id} className="p-3 border border-nord4 dark:border-nord2 rounded bg-nord6 dark:bg-nord1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold text-nord1 dark:text-nord6">{v.patient}</div>
                                            <div className="text-xs font-mono text-nord10">
                                                {new Date(v.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-sm text-nord3 dark:text-nord4 mb-3">{v.reason}</div>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            variant={activeCall?.id === v.id ? 'outline' : 'primary'}
                                            disabled={!!activeCall}
                                            onClick={() => handleJoin(v)}
                                        >
                                            {activeCall?.id === v.id ? 'In Call' : 'Join Room'}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="bg-nord14/10 border-nord14">
                        <Card.Body>
                            <div className="text-sm text-nord14 font-semibold mb-1">System Check</div>
                            <div className="text-xs text-nord14/80 flex flex-col gap-1">
                                <div className="flex justify-between">
                                    <span>Camera</span>
                                    <span>Ready</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Microphone</span>
                                    <span>Ready</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Connection</span>
                                    <span>Excellent</span>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </ModuleLayout>
    );
}
