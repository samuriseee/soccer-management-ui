/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import type { PropsWithChildren } from 'react'
import styles from './FullScreenLayout.module.scss'

interface FullScreenLayoutProps extends PropsWithChildren {
    children: React.ReactNode
    isMarginTop?: boolean
}

const FullScreenLayout: React.FC<FullScreenLayoutProps> = ({
    isMarginTop = true,
    children,
}) => {
    return (
        <div
            className={`${styles.layout_container} ${isMarginTop ? styles.layout_margin_top : ''}`}
        >
            {children}
        </div>
    )
}
export default FullScreenLayout
