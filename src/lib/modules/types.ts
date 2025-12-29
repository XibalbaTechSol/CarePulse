/**
 * Healthcare Module System - Type Definitions
 * 
 * This module defines the core interfaces for the healthcare-agnostic
 * modular architecture, supporting multiple service types.
 */

/**
 * Healthcare Service Types
 * Defines all supported healthcare service scenarios
 */
export enum ServiceType {
    HOME_HEALTH = 'home_health',
    HOSPICE = 'hospice',
    PERSONAL_CARE = 'personal_care',
    SKILLED_NURSING = 'skilled_nursing',
    ASSISTED_LIVING = 'assisted_living',
    THERAPY_SERVICES = 'therapy_services',
    REHABILITATION = 'rehabilitation',
    PEDIATRIC_CARE = 'pediatric_care',
    PALLIATIVE_CARE = 'palliative_care',
}

/**
 * Module Categories
 * Groups modules by their primary function
 */
export enum ModuleCategory {
    CLINICAL = 'clinical',
    ADMINISTRATIVE = 'administrative',
    FINANCIAL = 'financial',
    COMMUNICATION = 'communication',
    COMPLIANCE = 'compliance',
    ANALYTICS = 'analytics',
    INTEGRATION = 'integration',
}

/**
 * Module Permissions
 * Defines what a module can access
 */
export interface ModulePermission {
    resource: string; // e.g., 'contacts', 'visits', 'billing'
    actions: ('read' | 'write' | 'delete' | 'execute')[];
}

/**
 * Module Configuration Schema
 * Defines configurable settings for a module
 */
export interface ModuleConfigField {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect' | 'json';
    required: boolean;
    default?: any;
    options?: { value: string; label: string }[];
    description?: string;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        custom?: (value: any) => boolean | string;
    };
}

/**
 * Module Route Definition
 * Defines pages/routes provided by the module
 */
export interface ModuleRoute {
    path: string; // e.g., '/dashboard/crm'
    component: string; // Component name or path
    title: string;
    icon?: string;
    permissions?: string[];
    showInNav?: boolean;
    navGroup?: string; // For grouping in navigation
    order?: number;
}

/**
 * Module Components
 * Exportable UI components from the module
 */
export interface ModuleComponents {
    widgets?: {
        [key: string]: {
            component: string;
            title: string;
            description?: string;
            defaultSize?: 'small' | 'medium' | 'large';
        };
    };
    forms?: {
        [key: string]: {
            component: string;
            schema: any;
        };
    };
    reports?: {
        [key: string]: {
            component: string;
            title: string;
            category?: string;
        };
    };
}

/**
 * Module API Endpoints
 * Defines backend endpoints provided by the module
 */
export interface ModuleEndpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    handler: string;
    permissions?: string[];
}

/**
 * Module Event Definition
 * Events that modules can emit or subscribe to
 */
export interface ModuleEvent {
    name: string;
    payload?: any;
    metadata?: {
        module: string;
        timestamp: Date;
        userId?: string;
    };
}

/**
 * Module Hook Definition
 * Lifecycle hooks and extension points
 */
export interface ModuleHooks {
    onActivate?: () => Promise<void>;
    onDeactivate?: () => Promise<void>;
    onConfigure?: (config: any) => Promise<void>;
    onServiceTypeChange?: (newServiceType: ServiceType) => Promise<void>;
}

/**
 * Main Healthcare Module Interface
 * Complete definition of a healthcare module
 */
export interface HealthcareModule {
    // Module Identity
    id: string; // Unique identifier (e.g., 'crm', 'evv', 'billing')
    name: string; // Display name
    description: string;
    version: string;
    author?: string;

    // Categorization
    category: ModuleCategory;
    serviceTypes: ServiceType[]; // Which service types this module supports

    // Dependencies
    requiredModules?: string[]; // Module IDs that must be active
    optionalModules?: string[]; // Modules that enhance functionality if present

    // Configuration
    configSchema: ModuleConfigField[];
    defaultConfig?: Record<string, any>;

    // UI & Navigation
    routes: ModuleRoute[];
    components: ModuleComponents;
    icon?: string;
    color?: string; // Nord color variable name

    // Permissions & Security
    permissions: ModulePermission[];
    requiredPermissions?: string[]; // User must have these to use module

    // Backend Integration
    endpoints?: ModuleEndpoint[];

    // Events & Communication
    emittedEvents?: string[]; // Events this module emits
    subscribedEvents?: string[]; // Events this module listens to

    // Lifecycle
    hooks?: ModuleHooks;

    // Metadata
    enabled: boolean;
    isCore?: boolean; // Core modules cannot be disabled
    tags?: string[];
}

/**
 * Module Configuration Instance
 * Actual configuration for a module in an organization
 */
export interface ModuleConfiguration {
    moduleId: string;
    organizationId: string;
    enabled: boolean;
    config: Record<string, any>;
    overrides?: {
        routes?: Partial<ModuleRoute>[];
        permissions?: ModulePermission[];
    };
    customizations?: {
        branding?: {
            name?: string;
            icon?: string;
            color?: string;
        };
        workflows?: any[];
    };
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Service Type Configuration
 * Organization-level service type settings
 */
export interface ServiceTypeConfig {
    organizationId: string;
    serviceType: ServiceType;
    regulatoryState?: string; // e.g., 'WI', 'CA', 'TX'
    regulatoryFramework?: string; // e.g., 'Medicaid', 'Medicare', 'Private'

    // Service-specific configurations
    clinicalSettings?: {
        assessmentTypes?: string[];
        documentationRequirements?: string[];
        visitTypes?: string[];
    };

    billingSettings?: {
        payerTypes?: string[];
        claimFormats?: string[];
        billingCycles?: string[];
    };

    complianceSettings?: {
        requiredForms?: string[];
        auditFrequency?: string;
        recordRetention?: number; // days
    };
}

/**
 * Module Registry Entry
 * Runtime information about a registered module
 */
export interface ModuleRegistryEntry {
    module: HealthcareModule;
    status: 'inactive' | 'active' | 'error' | 'configuring';
    configuration?: ModuleConfiguration;
    loadedAt?: Date;
    error?: Error;
}

/**
 * Inter-Module Message
 * For communication between modules
 */
export interface InterModuleMessage {
    from: string; // Module ID
    to: string | '*'; // Module ID or broadcast
    type: 'request' | 'response' | 'event' | 'notification';
    action?: string;
    payload?: any;
    requestId?: string;
    timestamp: Date;
}

/**
 * Module Query
 * For finding modules in the registry
 */
export interface ModuleQuery {
    category?: ModuleCategory;
    serviceType?: ServiceType;
    enabled?: boolean;
    tags?: string[];
    isCore?: boolean;
}
