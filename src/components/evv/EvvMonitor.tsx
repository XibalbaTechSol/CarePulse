'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Phone, MapPin, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
// Dynamically import Map component to avoid SSR issues with Leaflet
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const CircleMarker = dynamic(
    () => import('react-leaflet').then((mod) => mod.CircleMarker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

export default function EvvMonitor() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const locations = [
        { id: 1, lat: 43.0731, lng: -89.4012, status: 'active', name: 'Active Visit' },
        { id: 2, lat: 43.0800, lng: -89.3900, status: 'active', name: 'Active Visit' },
        { id: 3, lat: 43.0600, lng: -89.4100, status: 'late', name: 'Late Start' },
        { id: 4, lat: 43.0900, lng: -89.4200, status: 'warning', name: 'GPS Warning' },
    ];

    const getColor = (status: string) => {
        switch (status) {
            case 'late': return '#ef4444';
            case 'warning': return '#f97316';
            default: return '#22c55e';
        }
    };

    return (
        <div className="flex h-full gap-6 p-6 overflow-hidden">
            {/* Left: Map & Stats */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 shrink-0">
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark">
                        <p className="text-xs text-text-muted uppercase font-bold">In Progress</p>
                        <p className="text-2xl font-bold mt-1 text-white">14</p>
                    </div>
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark">
                        <p className="text-xs text-text-muted uppercase font-bold">Late Starts</p>
                        <p className="text-2xl font-bold mt-1 text-error">2</p>
                    </div>
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark">
                        <p className="text-xs text-text-muted uppercase font-bold">GPS Mismatch</p>
                        <p className="text-2xl font-bold mt-1 text-warning">1</p>
                    </div>
                    <div className="bg-surface-dark p-4 rounded-xl border border-border-dark">
                        <p className="text-xs text-text-muted uppercase font-bold">Verified (Today)</p>
                        <p className="text-2xl font-bold mt-1 text-success">42</p>
                    </div>
                </div>

                {/* Map */}
                <div className="flex-1 bg-surface-dark rounded-xl border border-border-dark p-1 relative z-0 overflow-hidden">
                    {isMounted && (
                        <MapContainer
                            center={[43.0731, -89.4012]}
                            zoom={12}
                            style={{ height: '100%', width: '100%', borderRadius: '0.75rem', filter: 'grayscale(1) invert(1) brightness(0.8)' }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {locations.map(loc => (
                                <CircleMarker
                                    key={loc.id}
                                    center={[loc.lat, loc.lng]}
                                    pathOptions={{
                                        color: '#fff',
                                        fillColor: getColor(loc.status),
                                        fillOpacity: 0.8,
                                        weight: 2
                                    }}
                                    radius={8}
                                >
                                    <Popup>{loc.name}</Popup>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    )}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-surface-dark/90 backdrop-blur border border-border-dark p-3 rounded-lg z-[400] text-xs">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-success border border-white"></span>
                            <span>Active (On Time)</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-3 h-3 rounded-full bg-error border border-white"></span>
                            <span>Late / Missed</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-warning border border-white"></span>
                            <span>GPS Warning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Exceptions */}
            <div className="w-96 bg-surface-dark rounded-xl border border-border-dark flex flex-col shrink-0 overflow-hidden">
                <div className="p-4 border-b border-border-dark flex justify-between items-center bg-error/5">
                    <h3 className="font-bold text-red-400 flex items-center gap-2">
                        <AlertTriangle size={20} />
                        Exceptions Required
                    </h3>
                    <span className="bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">3</span>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {/* Exception Items */}
                    <div className="p-3 bg-background-dark rounded border border-error/20 hover:border-error/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-white text-sm">Late Start (&gt;15m)</p>
                                <p className="text-xs text-text-muted">Caregiver: Sarah Jenkins</p>
                                <p className="text-xs text-text-muted">Client: Martha Stewart</p>
                            </div>
                            <button className="bg-error hover:bg-red-600 text-white p-1 rounded transition-colors">
                                <Phone size={16} />
                            </button>
                        </div>
                        <div className="mt-2 text-[10px] text-slate-500 bg-black/20 p-1.5 rounded">
                            Scheduled: 9:00 AM <br />
                            Current Time: 9:22 AM <br />
                            <span className="text-red-400 font-bold">Status: Not Clocked In</span>
                        </div>
                    </div>

                    <div className="p-3 bg-background-dark rounded border border-warning/20 hover:border-warning/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-white text-sm">GPS Mismatch</p>
                                <p className="text-xs text-text-muted">Caregiver: John Doe</p>
                                <p className="text-xs text-text-muted">Client: George Miller</p>
                            </div>
                            <MapPin size={18} className="text-warning" />
                        </div>
                        <div className="mt-2 text-[10px] text-slate-500 bg-black/20 p-1.5 rounded flex items-center gap-2">
                            <span className="text-orange-400">Clock-in was 0.5 miles from client home.</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button className="flex-1 py-1 text-[10px] bg-border-dark hover:bg-white/10 rounded">Reject</button>
                            <button className="flex-1 py-1 text-[10px] bg-primary hover:bg-blue-600 rounded text-white">Approve w/ Note</button>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border-dark bg-surface-dark">
                    <h3 className="font-bold text-sm text-slate-300 mb-3">Live Feed</h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 text-xs">
                            <span className="text-success font-mono">10:42 AM</span>
                            <div className="text-slate-400">
                                <span className="text-white font-semibold">Verify</span> received for <span className="text-blue-400">Visit #9901</span>
                            </div>
                        </div>
                        <div className="flex gap-3 text-xs">
                            <span className="text-success font-mono">10:38 AM</span>
                            <div className="text-slate-400">
                                <span className="text-white font-semibold">Clock-Out</span> recorded for <span className="text-blue-400">Visit #9900</span>
                            </div>
                        </div>
                        <div className="flex gap-3 text-xs">
                            <span className="text-success font-mono">10:15 AM</span>
                            <div className="text-slate-400">
                                <span className="text-white font-semibold">Clock-In</span> recorded for <span className="text-blue-400">Visit #9902</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
