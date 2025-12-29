
'use client'

import React, { useState, useEffect } from 'react';
import { ModuleLayout } from '@/components/modules/ModuleLayout';
import { Package, AlertTriangle, Truck, ShoppingCart } from 'lucide-react';
import { Card, Button, Badge } from '@/components/nord';
import { getInventoryItems, processReorder } from '@/lib/actions/administrative/inventory';

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);

    const loadData = async () => {
        const data = await getInventoryItems('mock-org');
        setItems(data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleReorder = async (id: string) => {
        await processReorder(id, 10);
        loadData(); // Refresh after reorder
        alert('Reorder request submitted!');
    };

    const lowStockItems = items.filter(i => i.quantity <= i.reorderLevel);

    return (
        <ModuleLayout
            moduleName="Supply Chain"
            moduleIcon={<Package className="w-5 h-5" />}
            breadcrumbs={[{ label: 'Inventory', href: '/dashboard/admin/inventory' }]}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className={lowStockItems.length > 0 ? 'bg-nord11/10 border-nord11' : ''}>
                    <Card.Body className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className={`text-xs font-bold uppercase ${lowStockItems.length > 0 ? 'text-nord11' : 'text-nord3 dark:text-nord4'}`}>Low Stock Alerts</div>
                                <div className={`text-2xl font-bold ${lowStockItems.length > 0 ? 'text-nord11' : 'text-nord1 dark:text-nord6'}`}>{lowStockItems.length}</div>
                            </div>
                            <AlertTriangle className={`w-8 h-8 ${lowStockItems.length > 0 ? 'text-nord11' : 'text-nord3 dark:text-nord4'}`} />
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold uppercase text-nord10">Open Orders</div>
                                <div className="text-2xl font-bold text-nord1 dark:text-nord6">3</div>
                            </div>
                            <Truck className="w-8 h-8 text-nord10" />
                        </div>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold uppercase text-nord14">Total Value</div>
                                <div className="text-2xl font-bold text-nord1 dark:text-nord6">$12.4k</div>
                            </div>
                            <Package className="w-8 h-8 text-nord14" />
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <Card>
                <Card.Header>
                    <div>
                        <h3 className="text-lg font-semibold text-nord1 dark:text-nord6">Inventory List</h3>
                        <p className="text-sm text-nord3 dark:text-nord4">Current stock levels across all locations</p>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-nord4 dark:border-nord2 rounded-lg hover:bg-nord6 dark:hover:bg-nord1">
                                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                    <div className="bg-nord4 dark:bg-nord2 p-2 rounded">
                                        <Package className="w-6 h-6 text-nord3 dark:text-nord4" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-nord1 dark:text-nord6">{item.name}</div>
                                        <div className="text-sm text-nord3 dark:text-nord4">
                                            {item.category} • {item.location}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${item.quantity <= item.reorderLevel ? 'text-nord11' : 'text-nord1 dark:text-nord6'}`}>
                                            {item.quantity} {item.unit}
                                        </div>
                                        <div className="text-xs text-nord3 dark:text-nord4">Reorder at {item.reorderLevel}</div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={item.quantity <= item.reorderLevel ? 'primary' : 'outline'}
                                        onClick={() => handleReorder(item.id)}
                                        className={item.quantity <= item.reorderLevel ? 'bg-nord11 hover:bg-nord11/90 border-nord11' : ''}
                                    >
                                        <ShoppingCart className="w-4 h-4 mr-2" /> Reorder
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card.Body>
            </Card>
        </ModuleLayout>
    );
}
