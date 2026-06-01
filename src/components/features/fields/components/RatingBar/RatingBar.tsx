/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import React from 'react'
import styles from './RatingBar.module.scss'
import Star from '@/components/ui/Star/Star'
import Progress from '@/components/ui/Progress/Progress'

interface RatingBarProps {
    rating: number
    ratingValue: number
}

const RatingBar: React.FC<RatingBarProps> = ({ rating, ratingValue }) => {
    return (
        <div className={styles.rating_bar}>
            <div className={styles.stars}>
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        size={16}
                        className={styles.star_icon}
                        fill={
                            index < rating
                                ? 'var(--background-star-full)'
                                : 'var(--background-star-empty)'
                        }
                        stroke={
                            index < rating
                                ? 'var(--background-star-full)'
                                : 'var(--border-star-empty)'
                        }
                    />
                ))}
            </div>
            <Progress percent={ratingValue} className={styles.progress_bar} showPercentage/>
        </div>
    )
}

export default RatingBar
