/**
 * Healthcare Module System - Exports
 * 
 * Central export point for the module system
 */

export * from './types';
export * from './registry';

// Re-export commonly used types
export type {
    HealthcareModule,
    ModuleCategory,
    ServiceType,
    ModuleConfiguration,
    ModuleRegistryEntry,
} from './types';

// Re-export registry instance
export { moduleRegistry } from './registry';
