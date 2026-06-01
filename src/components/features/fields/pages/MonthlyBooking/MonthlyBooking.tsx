/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useMemo, useState } from 'react'
import styles from './MonthlyBooking.module.scss'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import Select from '@/components/ui/Select/Select'
import Button from '@/components/ui/Button/Button'
import {
    WEEK_DAYS,
    parseTimeToMinutes,
    formatMinutesToTime,
    DISCOUNT_MAP,
} from './MonthlyBooking.helper'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import { useMutation } from '@tanstack/react-query'
import { showMessage } from '@/components/ui/Notification/Notification'
import { useBookingTypes } from '@/hooks/useBookingTypes'
import ModalConfirm from '@/components/features/home/ModalConfirm'
import Loading from '@/app/[locale]/loading'

interface MonthlyBookingProps {
    gioMoCua: string
    gioDongCua: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    maSanChiTiet: string
    onClose: () => void
    refetchBookedSlots?: () => void
}

const MonthlyBooking: React.FC<MonthlyBookingProps> = ({
    gioMoCua,
    gioDongCua,
    giaThueBuoiSang,
    giaThueBuoiToi,
    maSanChiTiet,
    onClose,
    refetchBookedSlots,
}) => {
    const [startDate, setStartDate] = useState<string>()
    const [selectedTime, setSelectedTime] = useState<string>()
    const [selectedDays, setSelectedDays] = useState<number[]>([])
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Sinh danh sách giờ bắt đầu dựa vào giờ mở/đóng cửa, mỗi slot 1 tiếng
    const timeOptions = useMemo(() => {
        const open = parseTimeToMinutes(gioMoCua)
        const close = parseTimeToMinutes(gioDongCua)
        const result: string[] = []
        for (let t = open; t + 60 <= close; t += 60) {
            result.push(formatMinutesToTime(t))
        }
        return result
    }, [gioMoCua, gioDongCua])

    const handleToggleDay = (day: number) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        )
    }

    // Khi gửi API:
    // gioBatDau = selectedTime
    // gioKetThuc = tăng selectedTime lên 1 tiếng

    // Tính giá slot
    const getSlotPrice = () => {
        if (!selectedTime) return 0
        const hour = parseInt(selectedTime.split(':')[0], 10)
        const minute = parseInt(selectedTime.split(':')[1], 10)
        // Giờ chẵn: sau 17h là tối, giờ lẻ: sau 17h30 là tối
        if (
            (minute === 0 && hour >= 17) ||
            (minute === 30 && (hour > 17 || (hour === 17 && minute === 30)))
        ) {
            return giaThueBuoiToi
        }
        return giaThueBuoiSang
    }

    // Tính tổng tiền tháng
    const slotPrice = getSlotPrice()
    const soBuoi = selectedDays.length
    const discount =
        DISCOUNT_MAP.find((d) => soBuoi >= d.min && soBuoi <= d.max)?.percent ||
        0
    const soTuan = 4
    const tongTienTruocGiam = slotPrice * soBuoi * soTuan
    const tongTienSauGiam = tongTienTruocGiam * (1 - discount / 100)

    // Helper: map selectedDays to API format (Chủ nhật = 7, others = 1-6)
    const mapDaysForApi = (days: number[]) =>
        days.map((d) => (d === 0 ? 7 : d)).sort((a, b) => a - b)

    const { mutate: createMonthlyBookingMutation, isPending: isBooking } =
        useMutation({
            mutationFn: (payload: any) =>
                timeSlotsService.createMonthlyBooking(payload),
            onSuccess: () => {
                showMessage('success', 'Đặt sân tháng thành công!')
                if (refetchBookedSlots) refetchBookedSlots()
                onClose()
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message || 'Đặt sân tháng thất bại!'
                showMessage('error', errorMessage)
                console.error('Đặt sân tháng thất bại:', error)
            },
        })

    // Lấy danh sách loại hình đặt
    const { data: bookingTypes } = useBookingTypes()

    // Lấy maLoaiDat của "Đặt tháng"
    const monthlyBookingTypeId = bookingTypes?.find(
        (t: any) => t.tenLoaiDat === 'Đặt tháng'
    )?.maLoaiDat

    const handleMonthlyBooking = () => {
        setShowConfirmModal(true)
    }

    const handleConfirmBooking = () => {
        if (!startDate || !selectedTime || selectedDays.length < 2) return
        const ngayBatDau = startDate
        const start = new Date(startDate)
        const end = new Date(start)
        end.setDate(start.getDate() + 28)
        const ngayKetThuc = end.toISOString().slice(0, 10)
        const gioBatDau = selectedTime
        const [h, m] = selectedTime.split(':').map(Number)
        const gioKetThuc = `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
        const thuTrongTuan = mapDaysForApi(selectedDays)

        const payload = {
            maSanChiTiet,
            maLoaiDat: monthlyBookingTypeId ?? 'MONTHLY',
            ngayBatDau,
            ngayKetThuc,
            gioBatDau,
            gioKetThuc,
            thuTrongTuan,
        }
        createMonthlyBookingMutation(payload)
        setShowConfirmModal(false)
    }

    return (
        <div className={styles.monthly_booking_container}>
            {isBooking && <Loading />}
            <div className={styles.info_box}>
                <div className={styles.info_text}>
                    <b>Lưu ý:</b> Bạn phải chọn từ <b>2 buổi/tuần</b> trở lên để
                    đặt tháng.
                    <br />
                    <b>Bảng giảm giá:</b>
                    <br />
                    <ul className={styles.discount_list}>
                        <li>2 buổi/tuần: giảm 5%</li>
                        <li>3 buổi/tuần: giảm 7%</li>
                        <li>4 buổi/tuần: giảm 10%</li>
                        <li>5 buổi/tuần: giảm 12%</li>
                        <li>6 buổi/tuần: giảm 14%</li>
                        <li>7 buổi/tuần (trọn tuần): giảm 15%</li>
                    </ul>
                </div>
            </div>
            <div className={styles.form_row}>
                <label>Ngày bắt đầu:</label>
                <DatePicker
                    format="YYYY-MM-DD"
                    onChange={(_, dateStr) =>
                        setStartDate(
                            Array.isArray(dateStr) ? dateStr[0] : dateStr
                        )
                    }
                    className={styles.start_date_picker}
                    disabledDate={(current) =>
                        current && current.isBefore(new Date(), 'day')
                    }
                />
            </div>
            <div className={styles.form_row}>
                <label>Ngày kết thúc:</label>
                {startDate && (
                    <span className={styles.end_date_info}>
                        {(() => {
                            const start = new Date(startDate)
                            const end = new Date(start)
                            end.setDate(start.getDate() + 28)
                            return end.toISOString().slice(0, 10)
                        })()}
                    </span>
                )}
            </div>
            <div className={styles.form_row}>
                <label>Khung giờ:</label>
                <Select
                    value={selectedTime}
                    onChange={setSelectedTime}
                    className={styles.time_select}
                    placeholder="Chọn khung giờ"
                >
                    {timeOptions.map((t) => {
                        // Hiển thị dạng 17:00 - 18:00
                        const end = formatMinutesToTime(
                            parseTimeToMinutes(t) + 60
                        )
                        return (
                            <Select.Option
                                key={t}
                                value={t}
                            >{`${t} - ${end}`}</Select.Option>
                        )
                    })}
                </Select>
            </div>
            <div className={styles.form_row}>
                <label>Chọn thứ trong tuần:</label>
                <div className={styles.week_days}>
                    {WEEK_DAYS.map((d) => (
                        <Button
                            key={d.value}
                            type={
                                selectedDays.includes(d.value)
                                    ? 'primary'
                                    : 'default'
                            }
                            shape="square"
                            className={styles.week_day_btn}
                            onClick={() => handleToggleDay(d.value)}
                        >
                            {d.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className={styles.form_row}>
                <label>Tạm tính:</label>
                <span className={styles.price_text}>
                    {soBuoi < 2 || !selectedTime || !startDate
                        ? 'Vui lòng chọn đủ thông tin'
                        : `${tongTienSauGiam.toLocaleString('vi-VN')} đ/tháng (đã áp dụng giảm ${discount}%)`}
                </span>
            </div>
            <div className={styles.form_row}>
                <Button
                    type="primary"
                    disabled={soBuoi < 2 || !selectedTime || !startDate || isBooking}
                    onClick={handleMonthlyBooking}
                >
                    Đặt sân tháng
                </Button>
                <ModalConfirm
                    open={showConfirmModal}
                    onCancel={() => setShowConfirmModal(false)}
                    onClickConfirm={handleConfirmBooking}
                    title="Xác nhận đặt sân tháng"
                    description="Bạn có chắc chắn muốn đặt sân tháng với các thông tin đã chọn không? Vui lòng kiểm tra kỹ trước khi xác nhận."
                />
            </div>
        </div>
    )
}

export default MonthlyBooking
