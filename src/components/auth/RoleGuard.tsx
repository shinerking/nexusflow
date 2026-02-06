"use client";

import { type Role } from "@/lib/permissions";
import { canPerformAction, PERMISSIONS } from "@/lib/permissions";

type RoleGuardProps = {
    userRole: Role | undefined;
    action: keyof typeof PERMISSIONS;
    children: React.ReactNode;
    fallback?: React.ReactNode;
};

/**
 * Component to conditionally render children based on user role and permission
 * Usage: <RoleGuard userRole={user?.role} action="DELETE_PRODUCT">{children}</RoleGuard>
 */
export default function RoleGuard({
    userRole,
    action,
    children,
    fallback = null,
}: RoleGuardProps) {
    if (canPerformAction(userRole, action)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
