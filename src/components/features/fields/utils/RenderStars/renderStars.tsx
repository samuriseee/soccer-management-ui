/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Star } from 'lucide-react'
import styles from './RenderStars.module.scss'

export const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <Star
                key={`full-${i}`}
                className={styles.star_filled}
                fill="var(--background-star-full)"
                size={18}
            />
        )
    }

    if (hasHalfStar) {
        stars.push(
            <div key="half" className={styles.half_star_container}>
                <Star className={styles.half_star_empty} size={18} />
                <div className={styles.half_star}>
                    <Star
                        className={styles.star_filled}
                        fill="var(--background-star-full)"
                        size={18}
                    />
                </div>
            </div>
        )
    }

    for (let i = 0; i < emptyStars; i++) {
        stars.push(
            <Star key={`empty-${i}`} className={styles.star_empty} size={18} />
        )
    }

    return stars
}
