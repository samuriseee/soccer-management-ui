/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './SubFieldCard.module.scss'
import Button from '@/components/ui/Button/Button'
import CustomImage from '@/components/ui/CustomImage/CustomImage'
import BookingModal from '../../pages/BookingModal/BookingModal'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'

interface SubFieldCardProps {
    maSanChiTiet: string
    tenSanChiTiet: string
    tenLoaiSan: string
    giaThueBuoiSang: string
    giaThueBuoiToi: string
    media?: { link: string }[]
    isSelected: boolean
    onSelect: (id: string) => void
    gioMoCua: string
    gioDongCua: string
    bookedSlots?: Array<{
        date: string
        startTime: string
    }>
}

/**
 * Prop `bookedSlots` dùng để truyền danh sách các khung giờ đã được đặt trước cho từng sân chi tiết.
 * 
 * - Mỗi phần tử trong mảng là một object có dạng:
 *   {
 *     date: string // ngày đã đặt, định dạng "YYYY-MM-DD"
 *     startTime: string // giờ bắt đầu đã đặt, định dạng "HH:MM"
 *   }
 * 
 * - Khi mở BookingModal, prop này sẽ giúp xác định các slot thời gian nào đã bị đặt để disable hoặc hiển thị là "Đã đặt".
 * - Nếu không truyền hoặc truyền mảng rỗng, mặc định coi như chưa có slot nào bị đặt trước.
 * 
 * => bookedSlots giúp tránh double booking và hiển thị lịch đặt thực tế cho người dùng.
 */

const SubFieldCard: React.FC<SubFieldCardProps> = ({
    maSanChiTiet,
    tenSanChiTiet,
    tenLoaiSan,
    giaThueBuoiSang,
    giaThueBuoiToi,
    media,
    isSelected,
    onSelect,
    gioMoCua,
    gioDongCua,
    bookedSlots: bookedSlotsProp = [],
}) => {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

    // Lấy ngày bắt đầu (today) và ngày kết thúc (today + 21 ngày)
    const today = new Date()
    const fromDate = today.toISOString().split('T')[0]
    const toDateObj = new Date(today)
    toDateObj.setDate(today.getDate() + 21)
    const toDate = toDateObj.toISOString().split('T')[0]

    // Gọi API lấy các slot đã đặt cho sân chi tiết này CHỈ khi mở modal
    const { data: bookedSlotsData, isLoading: isLoadingBookedSlots, refetch } = useQuery({
        queryKey: ['booked-slots', maSanChiTiet, fromDate, toDate],
        queryFn: () =>
            timeSlotsService.getBookedSlots({
                maSanChiTiet,
                fromDate,
                toDate,
            }),
        enabled: isBookingModalOpen && !!maSanChiTiet, // chỉ gọi khi modal mở
    })

    // Chuyển đổi dữ liệu trả về cho BookingModal
    const bookedSlots =
        bookedSlotsData && Array.isArray(bookedSlotsData)
            ? bookedSlotsData.map((slot: any) => ({
                  date: slot.ngayDat, // giữ nguyên "YYYY-MM-DD" từ backend
                  startTime: slot.gioBatDau,
              }))
            : bookedSlotsProp
    
    const openBookingModal = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsBookingModalOpen(true)
    }

    return (
        <>
            <div
                className={`${styles.sub_field_card} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSelect(maSanChiTiet)}
            >
                <div className={styles.sub_field_image}>
                    <CustomImage
                        src={media && media[0]?.link}
                        alt={tenSanChiTiet}
                        className={styles.image}
                    />
                    <p className={styles.sub_field_type}>{tenLoaiSan}</p>
                </div>
                <div className={styles.sub_field_info}>
                    <h3 className={styles.sub_field_name}>{tenSanChiTiet}</h3>
                    <div className={styles.info_item}>
                        <span className={styles.info_label}>Loại sân:</span>
                        <span className={styles.info_value}>{tenLoaiSan}</span>
                    </div>
                    <div className={styles.sub_field_price_row}>
                        <span className={styles.sub_field_price_label}>
                            Ban ngày:
                        </span>
                        <span className={styles.sub_field_price_value}>
                            {Number(giaThueBuoiSang).toLocaleString('vi-VN')}{' '}
                            đ/giờ
                        </span>
                    </div>
                    <div className={styles.sub_field_price_row}>
                        <span className={styles.sub_field_price_label}>
                            Buổi tối:
                        </span>
                        <span className={styles.sub_field_price_value}>
                            {Number(giaThueBuoiToi).toLocaleString('vi-VN')}{' '}
                            đ/giờ
                        </span>
                    </div>
                </div>
                <Button
                    shape="square"
                    type="primary"
                    className={styles.book_button}
                    onClick={openBookingModal}
                >
                    Đặt sân
                </Button>
            </div>
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                maSanChiTiet={maSanChiTiet}
                tenSanChiTiet={tenSanChiTiet}
                tenLoaiSan={tenLoaiSan}
                gioMoCua={gioMoCua}
                gioDongCua={gioDongCua}
                giaThueBuoiSang={Number(giaThueBuoiSang)}
                giaThueBuoiToi={Number(giaThueBuoiToi)}
                bookedSlots={bookedSlots}
                refetchBookedSlots={refetch}
            />
        </>
    )
}

export default SubFieldCard
