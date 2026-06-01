/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import MainLayout from '@/components/layout/MainLayout'
import type { PropsWithChildren } from 'react'
import robotoFont from '@/core/config/fontConfig'

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return <MainLayout fontClass={robotoFont.className}>{children}</MainLayout>
}
export default Layout
