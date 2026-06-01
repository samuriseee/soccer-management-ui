/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './FeatureCard.module.scss'

interface FeaturedCardProps {
    icon: React.ReactNode
    title: string
    onClick?: () => void
}

const FeatureCard: React.FC<FeaturedCardProps> = ({ icon, title, onClick }) => {
    return (
        <div
            className={styles.feature_card}
            onClick={onClick}
            style={onClick ? { cursor: 'pointer' } : {}}
        >
            <div className={styles.feature_icon}>{icon}</div>
            <div className={styles.feature_rating}>⭐⭐⭐⭐⭐</div>
            <div className={styles.feature_title}>{title}</div>
        </div>
    )
}

export default FeatureCard
