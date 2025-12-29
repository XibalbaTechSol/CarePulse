/**
 * Healthcare Module Registry
 * 
 * Central registry for managing healthcare modules, their lifecycle,
 * and inter-module communication.
 */

import type {
    HealthcareModule,
    ModuleRegistryEntry,
    ModuleConfiguration,
    ModuleQuery,
    InterModuleMessage,
    ModuleEvent,
    ServiceType,
} from './types';

/**
 * Module Registry Singleton
 * Manages all registered modules and their states
 */
class ModuleRegistry {
    private static instance: ModuleRegistry;
    private modules: Map<string, ModuleRegistryEntry> = new Map();
    private eventBus: Map<string, Set<(event: ModuleEvent) => void>> = new Map();
    private messageQueue: InterModuleMessage[] = [];

    private constructor() {
        // Private constructor for singleton
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): ModuleRegistry {
        if (!ModuleRegistry.instance) {
            ModuleRegistry.instance = new ModuleRegistry();
        }
        return ModuleRegistry.instance;
    }

    /**
     * Register a new module
     */
    async register(module: HealthcareModule): Promise<void> {
        if (this.modules.has(module.id)) {
            throw new Error(`Module "${module.id}" is already registered`);
        }

        // Validate dependencies
        if (module.requiredModules) {
            for (const depId of module.requiredModules) {
                if (!this.modules.has(depId)) {
                    throw new Error(
                        `Module "${module.id}" requires "${depId}" which is not registered`
                    );
                }
            }
        }

        const entry: ModuleRegistryEntry = {
            module,
            status: 'inactive',
            loadedAt: new Date(),
        };

        this.modules.set(module.id, entry);
        console.log(`[ModuleRegistry] Registered module: ${module.id}`);
    }

    /**
     * Activate a module
     */
    async activate(
        moduleId: string,
        configuration?: ModuleConfiguration
    ): Promise<void> {
        const entry = this.modules.get(moduleId);
        if (!entry) {
            throw new Error(`Module "${moduleId}" is not registered`);
        }

        if (entry.status === 'active') {
            console.warn(`[ModuleRegistry] Module "${moduleId}" is already active`);
            return;
        }

        try {
            entry.status = 'configuring';

            // Run onActivate hook
            if (entry.module.hooks?.onActivate) {
                await entry.module.hooks.onActivate();
            }

            entry.configuration = configuration;
            entry.status = 'active';

            console.log(`[ModuleRegistry] Activated module: ${moduleId}`);

            // Emit activation event
            this.emit({
                name: `module:${moduleId}:activated`,
                payload: { moduleId },
                metadata: {
                    module: 'registry',
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            entry.status = 'error';
            entry.error = error as Error;
            throw error;
        }
    }

    /**
     * Deactivate a module
     */
    async deactivate(moduleId: string): Promise<void> {
        const entry = this.modules.get(moduleId);
        if (!entry) {
            throw new Error(`Module "${moduleId}" is not registered`);
        }

        if (entry.module.isCore) {
            throw new Error(`Cannot deactivate core module "${moduleId}"`);
        }

        if (entry.status === 'inactive') {
            return;
        }

        try {
            // Check if other modules depend on this one
            const dependents = this.getDependents(moduleId);
            if (dependents.length > 0) {
                const activeDependent = dependents.find(
                    (dep) => this.modules.get(dep)?.status === 'active'
                );
                if (activeDependent) {
                    throw new Error(
                        `Cannot deactivate "${moduleId}" - module "${activeDependent}" depends on it`
                    );
                }
            }

            // Run onDeactivate hook
            if (entry.module.hooks?.onDeactivate) {
                await entry.module.hooks.onDeactivate();
            }

            entry.status = 'inactive';
            console.log(`[ModuleRegistry] Deactivated module: ${moduleId}`);

            // Emit deactivation event
            this.emit({
                name: `module:${moduleId}:deactivated`,
                payload: { moduleId },
                metadata: {
                    module: 'registry',
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            entry.status = 'error';
            entry.error = error as Error;
            throw error;
        }
    }

    /**
     * Get a module by ID
     */
    get(moduleId: string): ModuleRegistryEntry | undefined {
        return this.modules.get(moduleId);
    }

    /**
     * Query modules
     */
    query(query: ModuleQuery): ModuleRegistryEntry[] {
        return Array.from(this.modules.values()).filter((entry) => {
            if (query.category && entry.module.category !== query.category) {
                return false;
            }

            if (
                query.serviceType &&
                !entry.module.serviceTypes.includes(query.serviceType)
            ) {
                return false;
            }

            if (query.enabled !== undefined) {
                const isEnabled = entry.status === 'active' && entry.module.enabled;
                if (isEnabled !== query.enabled) {
                    return false;
                }
            }

            if (query.isCore !== undefined && entry.module.isCore !== query.isCore) {
                return false;
            }

            if (query.tags && query.tags.length > 0) {
                const moduleTags = entry.module.tags || [];
                if (!query.tags.some((tag) => moduleTags.includes(tag))) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * Get all registered modules
     */
    getAll(): ModuleRegistryEntry[] {
        return Array.from(this.modules.values());
    }

    /**
     * Get active modules
     */
    getActive(): ModuleRegistryEntry[] {
        return Array.from(this.modules.values()).filter(
            (entry) => entry.status === 'active'
        );
    }

    /**
     * Get modules that depend on the given module
     */
    getDependents(moduleId: string): string[] {
        return Array.from(this.modules.values())
            .filter((entry) => entry.module.requiredModules?.includes(moduleId))
            .map((entry) => entry.module.id);
    }

    /**
     * Subscribe to an event
     */
    on(eventName: string, handler: (event: ModuleEvent) => void): () => void {
        if (!this.eventBus.has(eventName)) {
            this.eventBus.set(eventName, new Set());
        }

        const handlers = this.eventBus.get(eventName)!;
        handlers.add(handler);

        // Return unsubscribe function
        return () => {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.eventBus.delete(eventName);
            }
        };
    }

    /**
     * Emit an event
     */
    emit(event: ModuleEvent): void {
        const handlers = this.eventBus.get(event.name);
        if (handlers) {
            handlers.forEach((handler) => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(
                        `[ModuleRegistry] Error in event handler for "${event.name}":`,
                        error
                    );
                }
            });
        }

        // Also emit to wildcard listeners
        const wildcardHandlers = this.eventBus.get('*');
        if (wildcardHandlers) {
            wildcardHandlers.forEach((handler) => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(
                        `[ModuleRegistry] Error in wildcard event handler:`,
                        error
                    );
                }
            });
        }
    }

    /**
     * Send a message to another module
     */
    sendMessage(message: InterModuleMessage): void {
        if (message.to === '*') {
            // Broadcast
            this.emit({
                name: `message:broadcast`,
                payload: message,
                metadata: {
                    module: message.from,
                    timestamp: message.timestamp,
                },
            });
        } else {
            // Direct message
            this.emit({
                name: `message:${message.to}`,
                payload: message,
                metadata: {
                    module: message.from,
                    timestamp: message.timestamp,
                },
            });
        }
    }

    /**
     * Update service type for all modules
     */
    async updateServiceType(
        organizationId: string,
        newServiceType: ServiceType
    ): Promise<void> {
        const activeModules = this.getActive();

        for (const entry of activeModules) {
            if (entry.module.hooks?.onServiceTypeChange) {
                try {
                    await entry.module.hooks.onServiceTypeChange(newServiceType);
                } catch (error) {
                    console.error(
                        `[ModuleRegistry] Error updating service type for "${entry.module.id}":`,
                        error
                    );
                }
            }
        }

        this.emit({
            name: 'serviceType:changed',
            payload: { organizationId, serviceType: newServiceType },
            metadata: {
                module: 'registry',
                timestamp: new Date(),
            },
        });
    }

    /**
     * Clear all modules (for testing)
     */
    clear(): void {
        this.modules.clear();
        this.eventBus.clear();
        this.messageQueue = [];
    }
}

// Export singleton instance
export const moduleRegistry = ModuleRegistry.getInstance();

// Export class for type reference
export { ModuleRegistry };
