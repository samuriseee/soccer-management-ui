/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React from 'react'
import styles from './FootballFieldCard.module.scss'
import Button from '@/components/ui/Button/Button'
import { renderStars } from '../../utils/RenderStars/renderStars'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import CustomImage from '@/components/ui/CustomImage/CustomImage'

interface FootballField {
    maSanBong: string
    tenSan: string
    diaChi: string
    quanHuyen: string
    phuongXa: string
    thanhPho: string
    diemTrungBinhDanhGia: number | null
    media: { link: string }[]
}

interface FootballFieldCardProps {
    field: FootballField
}

const FootballFieldCard: React.FC<FootballFieldCardProps> = ({ field }) => {
    const router = useRouter()

    const handleCardClick = () => {
        router.push(`${NAVIGATION_PATHS.FIELD_LIST}/${field.maSanBong}`)
    }

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    // Ghép địa chỉ
    const address = [field.diaChi, field.phuongXa, field.quanHuyen, field.thanhPho]
        .filter(Boolean)
        .join(', ')

    // Lấy rating
    const rating = field.diemTrungBinhDanhGia ?? 0

    // Lấy image
    const image = field.media && field.media.length > 0 ? field.media[0].link : ''

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.image_container} onClick={handleImageClick}>
                <CustomImage src={image} alt={field.tenSan} />
            </div>
            <div className={styles.content}>
                <p className={styles.name}>{field.tenSan}</p>
                <p className={styles.address}>{address}</p>
                <div className={styles.rating}>
                    {!field.diemTrungBinhDanhGia ? (
                        <span className={styles.no_rating_text}>Chưa có đánh giá nào</span>
                    ) : (
                        <>
                            {renderStars(rating)}
                            <span className={styles.rating_value}>
                                {rating.toFixed(1)}
                            </span>
                        </>
                    )}
                </div>
                <Button
                    shape="square"
                    type="primary"
                    className={styles.book_button}
                    onClick={handleCardClick}
                >
                    Đặt sân ngay
                </Button>
            </div>
        </div>
    )
}

export default FootballFieldCard
