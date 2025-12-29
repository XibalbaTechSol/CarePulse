
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { BedDouble, User, Activity, CheckCircle, PaintBucket } from 'lucide-react';
import { Card, Badge, Button } from '@/components/nord';
import { getBedStatus, dischargePatient } from '@/lib/actions/hospital/beds';

export default function BedManagementPage() {
    const [beds, setBeds] = useState<any[]>([]);
    const [stats, setStats] = useState({ occupied: 0, available: 0, cleaning: 0 });

    const loadBeds = async () => {
        const data = await getBedStatus('mock-org-id');
        setBeds(data as any[]);

        // Calculate stats
        const occupied = data.filter((b: any) => b.status === 'OCCUPIED').length;
        const available = data.filter((b: any) => b.status === 'AVAILABLE').length;
        const cleaning = data.filter((b: any) => b.status === 'CLEANING').length;
        setStats({ occupied, available, cleaning });
    };

    useEffect(() => {
        loadBeds();
    }, []);

    const handleDischarge = async (bedId: string) => {
        await dischargePatient(bedId);
        loadBeds(); // Refresh
        alert('Patient discharged. Bed marked for cleaning.');
    };

    return (
        <ModuleLayout
            moduleName="Bed Management"
            moduleIcon={<BedDouble className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Beds', href: '/dashboard/beds' }]}
        >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="bg-nord14/20 border-nord14">
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord14 font-bold uppercase">Available</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">{stats.available}</div>
                        </div>
                        <CheckCircle className="w-8 h-8 text-nord14" />
                    </Card.Body>
                </Card>
                <Card className="bg-nord11/20 border-nord11">
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord11 font-bold uppercase">Occupied</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">{stats.occupied}</div>
                        </div>
                        <User className="w-8 h-8 text-nord11" />
                    </Card.Body>
                </Card>
                <Card className="bg-nord13/20 border-nord13">
                    <Card.Body className="p-4 flex items-center justify-between">
                        <div>
                            <div className="text-xs text-nord13 font-bold uppercase">Cleaning/Maint</div>
                            <div className="text-2xl font-bold text-nord1 dark:text-nord6">{stats.cleaning}</div>
                        </div>
                        <PaintBucket className="w-8 h-8 text-nord13" />
                    </Card.Body>
                </Card>
            </div>

            {/* Ward View */}
            <Card>
                <Card.Header>
                    <div>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Floor Plan View</h3>
                        <p className="text-sm text-nord3 dark:text-nord4">ICU & MedSurg Units</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {beds.map(bed => (
                            <div
                                key={bed.id}
                                className={`
                                    border rounded-lg p-4 flex flex-col justify-between h-40 relative
                                    ${bed.status === 'OCCUPIED' ? 'bg-nord11/10 border-nord11' :
                                        bed.status === 'AVAILABLE' ? 'bg-nord14/10 border-nord14' : 'bg-nord13/10 border-nord13'}
                                `}
                            >
                                <div className="flex justify-between items-start">
                                    <Badge variant="primary" className="bg-nord6 dark:bg-nord1">
                                        {bed.ward} - {bed.roomNumber}{bed.bedNumber}
                                    </Badge>
                                    {bed.status === 'OCCUPIED' && (
                                        <Activity className="w-4 h-4 text-nord11 animate-pulse" />
                                    )}
                                </div>

                                <div className="text-center my-2">
                                    {bed.status === 'OCCUPIED' ? (
                                        <div className="flex flex-col items-center text-nord11">
                                            <User className="w-8 h-8 mb-1" />
                                            <span className="font-semibold text-sm">Patient Assigned</span>
                                        </div>
                                    ) : bed.status === 'AVAILABLE' ? (
                                        <div className="flex flex-col items-center text-nord14">
                                            <CheckCircle className="w-8 h-8 mb-1" />
                                            <span className="font-semibold text-sm">Available</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-nord13">
                                            <PaintBucket className="w-8 h-8 mb-1" />
                                            <span className="font-semibold text-sm">Cleaning</span>
                                        </div>
                                    )}
                                </div>

                                {bed.status === 'OCCUPIED' && (
                                    <Button size="sm" variant="outline" className="w-full bg-nord6 dark:bg-nord1 hover:bg-nord11 hover:text-nord6 hover:border-nord11 border-nord11 text-nord11" onClick={() => handleDischarge(bed.id)}>
                                        Discharge
                                    </Button>
                                )}
                                {bed.status === 'AVAILABLE' && (
                                    <Button size="sm" variant="outline" className="w-full bg-nord6 dark:bg-nord1 hover:bg-nord14 hover:text-nord6 hover:border-nord14 border-nord14 text-nord14">
                                        Admit
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </ModuleLayout>
    );
}
