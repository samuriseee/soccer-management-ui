/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import AccountLayout from '@/components/layout/AccountLayout'
import RoleBasedGuard from '@/components/layout/auth/RoleBasedGuard'
import React, { PropsWithChildren } from 'react'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <RoleBasedGuard accessibleRoles={[undefined]}>
            <AccountLayout>{children}</AccountLayout>
        </RoleBasedGuard>
    )
}

export default Layout
