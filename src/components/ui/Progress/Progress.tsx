/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './Progress.module.scss'

interface ProgressProps {
    percent: number
    height?: number
    backgroundColor?: string
    fillColor?: string
    className?: string
    showPercentage?: boolean
}

const Progress: React.FC<ProgressProps> = ({
    percent,
    height = 8,
    backgroundColor = '#e0e0e0',
    fillColor = '#ffd700',
    className,
    showPercentage = false,
}) => {
    return (
        <div className={styles.progress_wrapper}>
            <div
                className={`${styles.progress_container} ${className || ''}`}
                style={{ height: `${height}px`, backgroundColor }}
            >
                <div
                    className={styles.progress_bar}
                    style={{ width: `${percent}%`, backgroundColor: fillColor }}
                />
            </div>
            {showPercentage && (
                <span className={styles.percentage_label}>{percent}%</span>
            )}
        </div>
    )
}

export default Progress
