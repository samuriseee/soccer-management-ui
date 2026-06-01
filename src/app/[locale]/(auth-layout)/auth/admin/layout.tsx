/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import RoleBasedGuard from '@/components/layout/auth/RoleBasedGuard'
import type { PropsWithChildren } from 'react'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <RoleBasedGuard accessibleRoles={['admin']}>
            {children}
        </RoleBasedGuard>
    )
}
export default Layout