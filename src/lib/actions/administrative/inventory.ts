
'use server'

import { db } from '../../db';

export async function getInventoryItems(organizationId: string) {
    // Mock inventory
    return [
        { id: '1', name: 'Nitrile Gloves (M)', category: 'Consumables', quantity: 45, unit: 'Box', reorderLevel: 50, location: 'Supply Room A' },
        { id: '2', name: 'IV Kits', category: 'Medical', quantity: 120, unit: 'Kit', reorderLevel: 100, location: 'Supply Room B' },
        { id: '3', name: 'Surgical Masks', category: 'Consumables', quantity: 500, unit: 'Box', reorderLevel: 200, location: 'Supply Room A' },
        { id: '4', name: 'Lidocaine 1% 50ml', category: 'Pharmaceuticals', quantity: 12, unit: 'Vial', reorderLevel: 15, location: 'Pharmacy' },
    ];
}

export async function processReorder(itemId: string, quantity: number) {
    // Logic to create PO
    return { success: true };
}
