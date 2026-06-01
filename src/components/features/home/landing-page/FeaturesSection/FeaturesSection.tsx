/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './FeaturesSection.module.scss'
import {
    IconCalendarClock,
    IconPlayFootball,
    IconSoccerField,
} from '@tabler/icons-react'
import FeatureCard from './FeatureCard/FeatureCard'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { useRouter } from '@/navigation'

const FeaturesSection = () => {
    const features = [
        { icon: <IconSoccerField size={52} />, title: 'Tìm kiếm vị trí sân', href: `${NAVIGATION_PATHS.FIELD_LIST}` },
        { icon: <IconCalendarClock size={52} />, title: 'Đặt lịch online' },
        { icon: <IconPlayFootball size={52} />, title: 'Tìm đối, bắt cặp đấu' },
    ]

    const router = useRouter()

    const handleClick = (href?: string) => {
        if (href && href !== '#') router.push(href)
    }

    return (
        <section className={styles.features_section}>
            <div className={styles.features_option_container}>
                <h2 className={styles.features_title}>
                    Khi sử dụng <span className={styles.highlight}>sportsync</span> bạn có thể
                </h2>
                <div className={styles.features_grid}>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            {...(feature.href ? { onClick: () => handleClick(feature.href) } : {})}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FeaturesSection
