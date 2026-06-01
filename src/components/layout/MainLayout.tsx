/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Layout } from 'antd'
import type { PropsWithChildren } from 'react'
import Header from './Header/Header'
import { Content } from 'antd/es/layout/layout'
import styles from './MainLayout.module.scss'
import FullScreenLayout from './FullScreenLayout'
import Footer from './Footer/Footer'

const MainLayout: React.FC<PropsWithChildren & { fontClass: string }> = ({
    children,
    fontClass,
}) => {
    return (
        <Layout className={styles.main_layout}>
            <Header />
            <FullScreenLayout>
                <Content className={fontClass}>{children}</Content>
            </FullScreenLayout>
            <Footer />
        </Layout>
    )
}
export default MainLayout
