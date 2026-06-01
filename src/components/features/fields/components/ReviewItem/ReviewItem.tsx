/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './ReviewItem.module.scss'
import AvatarUser from '@/components/ui/AvatarUser/AvatarUser'
import Star from '@/components/ui/Star/Star'

interface Review {
    id: string
    user: any
    comment: string
    rating: number
    date: string
    avatar?: string
}

interface ReviewItemProps {
    review: Review
    className?: string
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, className }) => {
    return (
        <div className={`${styles.review_item} ${className || ''}`}>
            <div className={styles.review_avatar}>
                <AvatarUser userInfo={{ hoTen: review.user, avatar: review.avatar }} size={40} />
            </div>
            <div className={styles.review_content}>
                <div className={styles.review_header}>
                    <span className={styles.reviewer_name}>{review.user}</span>
                    <div className={styles.review_rating}>
                        {[...Array(5)].map((_, index) => {
                            return (
                                <Star
                                    key={index}
                                    className={styles.star_icon}
                                    size={16}
                                    fill={
                                        index < review.rating
                                            ? 'var(--background-star-full)'
                                            : 'var(--background-star-empty)'
                                    }
                                    stroke={
                                        index < review.rating
                                            ? 'var(--background-star-full)'
                                            : 'var(--border-star-empty)'
                                    }
                                />
                            )
                        })}
                    </div>
                </div>
                <p className={styles.review_comment}>{review.comment}</p>
                <div className={styles.review_footer}>
                    <span className={styles.review_date}>{review.date}</span>
                    {/* <button className={styles.reply_button}>Trả lời</button> */}
                </div>
            </div>
        </div>
    )
}

export default ReviewItem
