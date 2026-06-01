/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import styles from './ReviewsSection.module.scss'
import RatingSummary from '../RatingSummary/RatingSummary'
import ReviewItem from '../ReviewItem/ReviewItem'
import Button from '@/components/ui/Button/Button'
import TextArea from '@/components/ui/Textarea/Textarea'
import Star from '@/components/ui/Star/Star'
import { useMutation } from '@tanstack/react-query'
import { reviewService } from '@/core/services/API/ReviewService/Review.service'
import { showMessage } from '@/components/ui/Notification/Notification'
import Pagination from '@/components/ui/Pagination/Pagination'

interface Review {
    id: string
    user: string
    comment: string
    rating: number
    date: string
    avatar: string
}

interface ReviewsSectionProps {
    maSanBong: string
    reviews: Review[]
    averageRating: number
    ratingDistribution: { [key: number]: number }
    refetchReviews?: () => void
    refetchField?: () => void
    reviewPage?: number
    setReviewPage?: (page: number) => void
    pageSize?: number
    totalReviews?: number
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
    maSanBong,
    reviews,
    averageRating,
    ratingDistribution,
    refetchReviews,
    refetchField,
    reviewPage,
    setReviewPage,
    pageSize,
    totalReviews,
}) => {
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false)
    const [rating, setRating] = useState<number>(0)
    const [comment, setComment] = useState<string>('')

    const { mutate: createReview } = useMutation({
        mutationFn: (data: ICreateReviewRequest) => reviewService.createReview(data),
        onSuccess: () => {
            showMessage("success", "Đánh giá của bạn đã được gửi thành công!")
            setIsReviewFormVisible(false)
            setRating(0)
            setComment('')
            refetchReviews && refetchReviews()
            refetchField && refetchField()
        },
        onError: (error: any) => {
            console.error("Error creating review:", error)
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại sau."
            showMessage("error", errorMessage)
        }
    })

    const handleReviewSubmit = () => {
        createReview({
            sanBongId: maSanBong,
            diemSo: rating,
            binhLuan: comment
        })
    }

    return (
        <div className={styles.reviews_section}>
            <h2 className={styles.section_title}>
                Đánh giá sân thể thao <p>({totalReviews ?? reviews.length} đánh giá)</p>
            </h2>
            <div className={styles.reviews_container}>
                <RatingSummary
                    averageRating={averageRating}
                    ratingDistribution={ratingDistribution}
                    onReviewClick={() => setIsReviewFormVisible((v) => !v)}
                />
                {isReviewFormVisible && (
                    <div className={styles.review_form}>
                        <h3>Đánh giá của bạn</h3>
                        <div className={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    fill={
                                        star <= rating
                                            ? 'var(--background-star-full)'
                                            : 'none'
                                    }
                                    stroke={
                                        star <= rating
                                            ? 'none'
                                            : 'var(--border-star-empty)'
                                    }
                                    className={styles.star}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <TextArea
                            placeholder="Viết nhận xét của bạn"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            shape="square"
                            type="primary"
                            onClick={handleReviewSubmit}
                            disabled={!comment.trim()}
                        >
                            Gửi đánh giá
                        </Button>
                    </div>
                )}
                <div className={styles.reviews_list}>
                    {reviews.map((review) => (
                        <ReviewItem key={review.id} review={review} className={styles.review_item} />
                    ))}
                </div>
                {typeof totalReviews === 'number' && totalReviews > (pageSize || 0) && setReviewPage && (
                    <div className={styles.pagination_wrapper}>
                        <Pagination
                            current={reviewPage || 1}
                            pageSize={pageSize || 8}
                            total={totalReviews}
                            onChange={setReviewPage}
                            showSizeChanger={false}
                            size="small"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReviewsSection
