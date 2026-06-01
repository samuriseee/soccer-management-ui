/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './RatingSummary.module.scss'
import Button from '@/components/ui/Button/Button'
import Star from '@/components/ui/Star/Star'
import RatingBar from '../RatingBar/RatingBar'

interface RatingSummaryProps {
    averageRating: number
    ratingDistribution: { [key: number]: number }
    onReviewClick: () => void
}

const RatingSummary: React.FC<RatingSummaryProps> = ({
    averageRating,
    ratingDistribution,
    onReviewClick,
}) => {
    return (
        <div className={styles.rating_summary}>
            <div className={styles.average_rating}>
                <div className={styles.average_label}>Trung bình</div>
                <div className={styles.average_score}>
                    <span className={styles.score}>{averageRating}</span>
                    <Star
                        className={styles.star_icon}
                        size={32}
                        fill="var(--background-star-full)"
                        stroke="var(--background-star-full)"
                    />
                </div>
                <Button
                    shape="square"
                    size="small"
                    type="primary"
                    className={styles.review_button}
                    onClick={onReviewClick}
                >
                    Đánh giá và nhận xét
                </Button>
            </div>

            <div className={styles.rating_distribution}>
                {[5, 4, 3, 2, 1].map((rating) => (
                    <RatingBar
                        key={rating}
                        rating={rating}
                        ratingValue={ratingDistribution[rating]}
                    />
                ))}
            </div>
        </div>
    )
}

export default RatingSummary
