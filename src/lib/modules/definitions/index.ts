/**
 * Core Module Definitions - Index
 * Exports all module definitions for registration
 */

export { crmModule } from './crm';

// Export all module definitions as an array for easy registration
import { crmModule } from './crm';

export const coreModules = [
    crmModule,
    // Additional modules will be added here
];
