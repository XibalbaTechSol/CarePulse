/**
 * Module Initialization
 * Auto-registers all core modules on app startup
 */

import { moduleRegistry } from './registry';
import { coreModules } from './definitions';

/**
 * Initialize all core modules
 * Call this during app initialization
 */
export async function initializeModules(): Promise<void> {
    console.log('[Modules] Initializing core modules...');

    for (const module of coreModules) {
        try {
            await moduleRegistry.register(module);

            // Auto-activate core modules
            if (module.isCore) {
                await moduleRegistry.activate(module.id, {
                    moduleId: module.id,
                    organizationId: 'default', // Will be replaced with actual org ID
                    enabled: true,
                    config: module.defaultConfig || {},
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        } catch (error) {
            console.error(`[Modules] Failed to initialize module "${module.id}":`, error);
        }
    }

    console.log(`[Modules] Initialized ${coreModules.length} core modules`);
}

/**
 * Get active module routes for navigation
 */
export function getActiveModuleRoutes() {
    const activeModules = moduleRegistry.getActive();
    const routes: any[] = [];

    for (const entry of activeModules) {
        const moduleRoutes = entry.module.routes
            .filter(route => route.showInNav)
            .map(route => ({
                ...route,
                moduleId: entry.module.id,
                color: entry.module.color,
            }));

        routes.push(...moduleRoutes);
    }

    // Sort by navGroup and order
    return routes.sort((a, b) => {
        if (a.navGroup !== b.navGroup) {
            return (a.navGroup || '').localeCompare(b.navGroup || '');
        }
        return (a.order || 0) - (b.order || 0);
    });
}
