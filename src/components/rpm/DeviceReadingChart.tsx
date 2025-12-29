
'use client'

import React from 'react';
import { Card } from '@/components/nord';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Reading {
    recordedAt: string;
    value: number;
    unit: string;
}

interface DeviceReadingChartProps {
    title: string;
    data: Reading[];
    color?: string;
    unit: string;
}

export function DeviceReadingChart({ title, data, color = "#8884d8", unit }: DeviceReadingChartProps) {
    // Format data for chart
    const chartData = data.map(d => ({
        time: new Date(d.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: d.value
    })).reverse(); // Chart usually expects chronological left-to-right

    return (
        <Card>
            <Card.Header className="pb-2">
                <h3 className="text-base font-medium text-nord1 dark:text-nord6">{title}</h3>
            </Card.Header>
            <Card.Body>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e9f0" />
                            <XAxis
                                dataKey="time"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                minTickGap={30}
                                stroke="#4c566a"
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                width={30}
                                stroke="#4c566a"
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(val: any) => [`${val} ${unit}`, title]}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={{ r: 3, fill: color }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card.Body>
        </Card>
    );
}
