/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import type { PropsWithChildren } from 'react'
import AuthGuard from '@/components/layout/auth/AuthGuard'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return <AuthGuard>{children}</AuthGuard>
}
export default Layout
