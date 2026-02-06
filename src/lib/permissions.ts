// Permission utilities for RBAC
export type Role = "ADMIN" | "MANAGER" | "STAFF" | "AUDITOR";

export const PERMISSIONS = {
    // Product/Inventory permissions
    ADD_PRODUCT: ["STAFF", "MANAGER", "ADMIN"],
    EDIT_PRODUCT: ["MANAGER", "ADMIN"], // Data Master - MANAGER only
    DELETE_PRODUCT: ["MANAGER", "ADMIN"],
    IMPORT_PRODUCTS: ["STAFF", "MANAGER", "ADMIN"],
    APPROVE_PRODUCT: ["MANAGER", "ADMIN"],

    // Stock Adjustment permissions
    ADJUST_STOCK: ["STAFF", "MANAGER", "ADMIN"],
    APPROVE_STOCK_ADJUSTMENT: ["MANAGER", "ADMIN"],
    VIEW_STOCK_LOGS: ["STAFF", "MANAGER", "ADMIN", "AUDITOR"],
    EXPORT_STOCK_LOGS: ["MANAGER", "ADMIN", "AUDITOR"], // STAFF removed

    // Approval Queue permissions
    ACCESS_APPROVALS: ["MANAGER", "ADMIN"],
    PROCESS_APPROVAL: ["MANAGER", "ADMIN"],

    // Procurement permissions
    CREATE_PROCUREMENT: ["STAFF", "MANAGER", "ADMIN"],
    APPROVE_PROCUREMENT: ["MANAGER", "ADMIN"],
    DELETE_PROCUREMENT: ["MANAGER", "ADMIN"],
    AI_GENERATE: ["MANAGER", "ADMIN"],

    // Export permissions (all roles)
    EXPORT_DATA: ["STAFF", "MANAGER", "ADMIN", "AUDITOR"],

    // Settings - restricted to MANAGER/ADMIN only
    ACCESS_SETTINGS: ["MANAGER", "ADMIN"],
    DANGER_ZONE: ["MANAGER", "ADMIN"],
} as const;

/**
 * Check if a user role has permission to perform an action
 */
export function canPerformAction(
    userRole: Role | undefined,
    action: keyof typeof PERMISSIONS
): boolean {
    if (!userRole) return false;
    return (PERMISSIONS[action] as readonly string[]).includes(userRole);
}

/**
 * Check if user is read-only (AUDITOR)
 */
export function isReadOnly(userRole: Role | undefined): boolean {
    return userRole === "AUDITOR";
}

/**
 * Check if user is admin or manager
 */
export function isAdminOrManager(userRole: Role | undefined): boolean {
    return userRole === "ADMIN" || userRole === "MANAGER";
}
