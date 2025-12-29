/**
 * CRM Module Definition
 * Client Relationship Management for Healthcare
 * 
 * Supports multiple healthcare service types with configurable workflows
 */

import type { HealthcareModule } from '../types';
import { ModuleCategory, ServiceType } from '../types';

export const crmModule: HealthcareModule = {
    id: 'crm',
    name: 'Client Relationship Management',
    description: 'Manage client intake, authorizations, and care coordination',
    version: '1.0.0',
    author: 'CarePulse',

    category: ModuleCategory.ADMINISTRATIVE,
    serviceTypes: [
        ServiceType.HOME_HEALTH,
        ServiceType.HOSPICE,
        ServiceType.PERSONAL_CARE,
        ServiceType.SKILLED_NURSING,
        ServiceType.ASSISTED_LIVING,
        ServiceType.THERAPY_SERVICES,
        ServiceType.REHABILITATION,
        ServiceType.PEDIATRIC_CARE,
        ServiceType.PALLIATIVE_CARE,
    ],

    configSchema: [
        {
            key: 'enableKanban',
            label: 'Enable Kanban Board',
            type: 'boolean',
            required: false,
            default: true,
            description: 'Show visual Kanban board for pipeline management',
        },
        {
            key: 'intakeStages',
            label: 'Intake Pipeline Stages',
            type: 'json',
            required: true,
            default: ['Referral', 'Assessment', 'Authorization', 'Active'],
            description: 'Customizable workflow stages for client intake',
        },
        {
            key: 'requiredFields',
            label: 'Required Client Fields',
            type: 'multiselect',
            required: false,
            default: ['firstName', 'lastName', 'dateOfBirth', 'address'],
            options: [
                { value: 'firstName', label: 'First Name' },
                { value: 'lastName', label: 'Last Name' },
                { value: 'dateOfBirth', label: 'Date of Birth' },
                { value: 'ssn', label: 'Social Security Number' },
                { value: 'medicaidId', label: 'Medicaid ID' },
                { value: 'address', label: 'Address' },
                { value: 'phone', label: 'Phone Number' },
                { value: 'email', label: 'Email' },
                { value: 'emergencyContact', label: 'Emergency Contact' },
            ],
        },
        {
            key: 'autoCreateAuthorization',
            label: 'Auto-create Authorization',
            type: 'boolean',
            required: false,
            default: false,
            description: 'Automatically create authorization record when client becomes active',
        },
    ],

    defaultConfig: {
        enableKanban: true,
        intakeStages: ['Referral', 'Assessment', 'Authorization', 'Active'],
        requiredFields: ['firstName', 'lastName', 'dateOfBirth', 'address'],
        autoCreateAuthorization: false,
    },

    routes: [
        {
            path: '/dashboard/crm',
            component: 'CRMDashboard',
            title: 'CRM Dashboard',
            icon: 'Users',
            showInNav: true,
            navGroup: 'main',
            order: 2,
        },
        {
            path: '/dashboard/crm/intake',
            component: 'IntakePipeline',
            title: 'Intake Pipeline',
            icon: 'UserPlus',
            showInNav: true,
            navGroup: 'crm',
            order: 1,
        },
        {
            path: '/dashboard/crm/authorizations',
            component: 'AuthorizationsManager',
            title: 'Authorizations',
            icon: 'FileCheck',
            showInNav: true,
            navGroup: 'crm',
            order: 2,
        },
        {
            path: '/dashboard/crm/coordination',
            component: 'CareCoordination',
            title: 'Care Coordination',
            icon: 'Network',
            showInNav: true,
            navGroup: 'crm',
            order: 3,
        },
        {
            path: '/dashboard/crm/clients/:id',
            component: 'ClientProfile',
            title: 'Client Profile',
            showInNav: false,
        },
    ],

    components: {
        widgets: {
            activeClients: {
                component: 'ActiveClientsWidget',
                title: 'Active Clients',
                description: 'Summary of active client caseload',
                defaultSize: 'medium',
            },
            intakePipeline: {
                component: 'IntakePipelineWidget',
                title: 'Intake Pipeline',
                description: 'Current intake status overview',
                defaultSize: 'large',
            },
            expiringAuthorizations: {
                component: 'ExpiringAuthorizationsWidget',
                title: 'Expiring Authorizations',
                description: 'Authorizations expiring soon',
                defaultSize: 'medium',
            },
        },
        reports: {
            clientRoster: {
                component: 'ClientRosterReport',
                title: 'Client Roster',
                category: 'Administrative',
            },
            authorizationStatus: {
                component: 'AuthorizationStatusReport',
                title: 'Authorization Status',
                category: 'Clinical',
            },
        },
    },

    permissions: [
        {
            resource: 'contacts',
            actions: ['read', 'write', 'delete'],
        },
        {
            resource: 'authorizations',
            actions: ['read', 'write', 'delete'],
        },
        {
            resource: 'deals',
            actions: ['read', 'write', 'delete'],
        },
        {
            resource: 'tasks',
            actions: ['read', 'write', 'delete'],
        },
        {
            resource: 'activities',
            actions: ['read', 'write'],
        },
    ],

    requiredPermissions: ['crm.view'],

    emittedEvents: [
        'client:created',
        'client:updated',
        'client:statusChanged',
        'authorization:created',
        'authorization:expiring',
        'authorization:expired',
    ],

    subscribedEvents: [
        'visit:completed',
        'billing:invoiceGenerated',
    ],

    hooks: {
        async onActivate() {
            console.log('[CRM Module] Activated');
        },
        async onDeactivate() {
            console.log('[CRM Module] Deactivated');
        },
        async onServiceTypeChange(newServiceType) {
            console.log(`[CRM Module] Service type changed to: ${newServiceType}`);
            // Could adjust default stages, fields, etc. based on service type
        },
    },

    enabled: true,
    isCore: true,
    icon: 'Users',
    color: 'nord8',
    tags: ['client-management', 'intake', 'authorizations'],
};
