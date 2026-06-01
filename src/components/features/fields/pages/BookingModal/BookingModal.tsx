/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import type React from 'react'
import { useState, useEffect } from 'react'
import styles from './BookingModal.module.scss'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import {
    formatDateRange,
    generateTimeSlots,
    getDayName,
    parseTimeToMinutes,
} from '@/helper/Utils/time'
import ScheduleGrid from '../../components/Booking/ScheduleGrid/ScheduleGrid'
import { useMutation } from '@tanstack/react-query'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import { showMessage } from '@/components/ui/Notification/Notification'
import { useBookingTypes } from '@/hooks/useBookingTypes'
import Alert from '@/components/ui/Alert/Alert'
import { Link } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import ModalConfirm from '@/components/features/home/ModalConfirm'
import MonthlyBooking from '../MonthlyBooking/MonthlyBooking'
import { useAuth } from '@/contexts/auth/AuthContext'
import LoginModal from '@/components/features/account/SignInModal/SignInModal'
import Loading from '@/app/[locale]/loading'

interface TimeSlot {
    id: string
    startTime: string
    endTime: string
    fullTime: string
    price: number
    isAvailable: boolean
    isExpired: boolean
}

interface DaySchedule {
    date: Date
    dayName: string
    dayNumber: number
    month: number
    slots: TimeSlot[]
}

interface BookingModalProps {
    isOpen: boolean
    onClose: () => void
    maSanChiTiet: string
    tenSanChiTiet: string
    tenLoaiSan: string
    gioMoCua: string
    gioDongCua: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    bookedSlots?: Array<{
        date: string // "YYYY-MM-DD" format
        startTime: string // "HH:MM" format
    }>
    refetchBookedSlots?: () => void
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    maSanChiTiet,
    tenSanChiTiet,
    tenLoaiSan,
    gioMoCua = '5:00',
    gioDongCua = '23:00',
    giaThueBuoiSang = 0,
    giaThueBuoiToi = 0,
    bookedSlots = [],
    refetchBookedSlots,
}) => {
    const [currentDateRange, setCurrentDateRange] = useState<{
        start: Date
        end: Date
    }>({
        start: new Date(),
        end: new Date(new Date().setDate(new Date().getDate() + 6)),
    })
    const [schedule, setSchedule] = useState<DaySchedule[]>([])
    const [activeTimeFrame, setActiveTimeFrame] = useState<
        'morning' | 'afternoon' | 'evening'
    >('morning')

    // Đổi selectedSlots sang lưu toàn cục, giữ lại khi chuyển khung giờ
    const [selectedSlotsByFrame, setSelectedSlotsByFrame] = useState<{
        morning: Array<{ day: DaySchedule; slot: TimeSlot }>
        afternoon: Array<{ day: DaySchedule; slot: TimeSlot }>
        evening: Array<{ day: DaySchedule; slot: TimeSlot }>
    }>({
        morning: [],
        afternoon: [],
        evening: [],
    })

    const getCurrentFrameSlots = () => selectedSlotsByFrame[activeTimeFrame]

    // Check if a slot is booked
    const isSlotBooked = (date: Date, startTime: string): boolean => {
        // Đảm bảo lấy ngày theo local (VN) chứ không dùng toISOString (vì toISOString là UTC, có thể bị lệch ngày)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const dateString = `${year}-${month}-${day}` // "YYYY-MM-DD" local

        return bookedSlots.some(
            (slot) => slot.date === dateString && slot.startTime === startTime
        )
    }

    // Thêm dòng này ngay sau khai báo các biến props/state
    const isHalfHourSlots = gioMoCua.endsWith(':30')

    // Generate mock schedule data
    useEffect(() => {
        if (!isOpen) return

        const generateSchedule = () => {
            const days: DaySchedule[] = []
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const currentDate = new Date(currentDateRange.start)
            currentDate.setHours(0, 0, 0, 0)

            // Only show dates from today forward
            if (currentDate < today) {
                currentDate.setTime(today.getTime())
                setCurrentDateRange({
                    start: currentDate,
                    end: new Date(
                        currentDate.getTime() + 6 * 24 * 60 * 60 * 1000
                    ),
                })
            }

            const now = new Date()
            const openingMinutes = parseTimeToMinutes(gioMoCua)
            const closingMinutes = parseTimeToMinutes(gioDongCua)

            // Create 7 days of schedule
            for (let i = 0; i < 7; i++) {
                const dayDate = new Date(currentDate)
                dayDate.setDate(currentDate.getDate() + i)

                const dayName = getDayName(dayDate.getDay())
                const dayNumber = dayDate.getDate()
                const month = dayDate.getMonth() + 1

                // Generate time slots based on opening/closing hours and morning/afternoon
                const timeSlots = generateTimeSlots(
                    isHalfHourSlots,
                    openingMinutes,
                    closingMinutes,
                    activeTimeFrame,
                    giaThueBuoiSang,
                    giaThueBuoiToi
                )

                // Mark slots as available/expired/booked
                const slots = timeSlots.map((slot, index) => {
                    const [startHour, startMinute] = slot.startTime
                        .split(':')
                        .map(Number)
                    const slotDate = new Date(dayDate)
                    slotDate.setHours(startHour, startMinute, 0)

                    // Check if slot is in the past
                    const isExpired = slotDate < now

                    // Check if slot is already booked
                    const isBooked = isSlotBooked(dayDate, slot.startTime)

                    // A slot is available if it's not expired and not booked
                    const isAvailable = !isExpired && !isBooked

                    return {
                        id: `${dayDate.toISOString()}-${index}`,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        fullTime: `${slot.startTime} - ${slot.endTime}`,
                        price: slot.price,
                        isAvailable,
                        isExpired,
                    }
                })

                days.push({
                    date: dayDate,
                    dayName,
                    dayNumber,
                    month,
                    slots,
                })
            }

            return days
        }
        setSchedule(generateSchedule())
    }, [
        isOpen,
        currentDateRange,
        activeTimeFrame,
        gioMoCua,
        gioDongCua,
        giaThueBuoiSang,
        giaThueBuoiToi,
        bookedSlots,
    ])

    const navigateDates = (direction: 'prev' | 'next') => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const maxEndDate = new Date(today)
        maxEndDate.setDate(today.getDate() + 20)
        maxEndDate.setHours(0, 0, 0, 0)

        let newStart = new Date(currentDateRange.start)
        let newEnd = new Date(currentDateRange.end)

        if (direction === 'prev') {
            newStart.setDate(newStart.getDate() - 7)
            newEnd.setDate(newEnd.getDate() - 7)

            if (newStart < today) return
        } else {
            newStart.setDate(newStart.getDate() + 7)
            newEnd.setDate(newEnd.getDate() + 7)

            // Đặt giờ phút giây về 0h trước khi so sánh
            newEnd.setHours(0, 0, 0, 0)

            if (newEnd > maxEndDate) return
        }

        setCurrentDateRange({ start: newStart, end: newEnd })
    }

    const handleSlotClick = (day: DaySchedule, slot: TimeSlot) => {
        setSelectedSlotsByFrame((prev) => {
            const frameSlots = prev[activeTimeFrame]
            const isAlreadySelected = frameSlots.some(
                (s) =>
                    s.day.date.getTime() === day.date.getTime() &&
                    s.slot.id === slot.id
            )
            let newFrameSlots
            if (isAlreadySelected) {
                newFrameSlots = frameSlots.filter(
                    (s) =>
                        !(
                            s.day.date.getTime() === day.date.getTime() &&
                            s.slot.id === slot.id
                        )
                )
            } else {
                newFrameSlots = [...frameSlots, { day, slot }]
            }
            return {
                ...prev,
                [activeTimeFrame]: newFrameSlots,
            }
        })
    }

    const getAllSelectedSlots = () => [
        ...selectedSlotsByFrame.morning,
        ...selectedSlotsByFrame.afternoon,
        ...selectedSlotsByFrame.evening,
    ]

    const { mutate: createDatSan, isPending: isBooking } = useMutation({
        mutationFn: (payload: {
            maSanChiTiet: string
            maLoaiDat: string
            soTien: number
            lichDat: Array<{
                ngayDat: string
                gioBatDau: string
                gioKetThuc: string
            }>
        }) => timeSlotsService.createDatSan(payload),
        onSuccess: (res) => {
            showMessage('success', 'Đặt sân thành công!')
            setSelectedSlotsByFrame({
                morning: [],
                afternoon: [],
                evening: [],
            })
            if (refetchBookedSlots) refetchBookedSlots()
            handleCloseModal()
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || 'Đặt sân thất bại!'
            showMessage('error', errorMessage)
            console.error('Đặt sân thất bại:', error)
        },
    })

    // Lấy danh sách loại hình đặt
    const { data: bookingTypes } = useBookingTypes()

    // Lấy maLoaiDat của "Đặt thông thường"
    const defaultBookingTypeId = bookingTypes?.find(
        (t: any) => t.tenLoaiDat === 'Đặt thông thường'
    )?.maLoaiDat

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [showMonthlyBooking, setShowMonthlyBooking] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const { isAuthenticated } = useAuth()

    const handleBookClick = () => {
        const allSelectedSlots = getAllSelectedSlots()
        if (allSelectedSlots.length > 0 && defaultBookingTypeId) {
            const lichDat = allSelectedSlots.map(({ day, slot }) => {
                // Đảm bảo lấy đúng ngày theo múi giờ VN, không bị lệch do toISOString()
                const year = day.date.getFullYear()
                const month = (day.date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')
                const date = day.date.getDate().toString().padStart(2, '0')
                const ngayDat = `${year}-${month}-${date}`
                return {
                    ngayDat,
                    gioBatDau: slot.startTime,
                    gioKetThuc: slot.endTime,
                }
            })
            const soTien = allSelectedSlots.reduce(
                (sum, { slot }) => sum + slot.price,
                0
            )
            const payload = {
                maSanChiTiet,
                maLoaiDat: defaultBookingTypeId ?? 'HOUR',
                soTien,
                lichDat,
            }
            createDatSan(payload)
        }
    }

    const handleOpenConfirm = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true)
            return
        }
        setShowConfirmModal(true)
    }

    const handleConfirmBooking = () => {
        setShowConfirmModal(false)
        handleBookClick()
    }

    const handleCancelConfirm = () => {
        setShowConfirmModal(false)
    }

    const handleCloseModal = () => {
        setSelectedSlotsByFrame({
            morning: [],
            afternoon: [],
            evening: [],
        })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.modal_container}>
                <div className={styles.modal_header}>
                    <h2 className={styles.modal_title}>
                        {tenSanChiTiet} - {tenLoaiSan}
                    </h2>
                    <button
                        className={styles.close_button}
                        onClick={handleCloseModal}
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.info_row}>
                    <Alert
                        type="warning"
                        className={styles.alert_info}
                        message={
                            <>
                                Vui lòng kiểm tra{' '}
                                <Link
                                    href={`${NAVIGATION_PATHS.DASH_BOARD_NGUOI_THUE}`}
                                    className={styles.balance_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    số dư tài khoản của bạn
                                </Link>{' '}
                                trên hệ thống trước khi tiến hành đặt sân để đảm
                                bảo giao dịch thành công.
                            </>
                        }
                    />
                    {showMonthlyBooking ? (
                        <Button
                            className={styles.toggle_booking_type_btn}
                            shape="square"
                            type="primary"
                            onClick={() => setShowMonthlyBooking(false)}
                        >
                            Đặt theo giờ
                        </Button>
                    ) : (
                        <Button
                            className={styles.toggle_booking_type_btn}
                            shape="square"
                            type="primary"
                            onClick={() => setShowMonthlyBooking(true)}
                        >
                            Đặt sân tháng
                        </Button>
                    )}
                </div>
                {showMonthlyBooking ? (
                    <MonthlyBooking
                        gioMoCua={gioMoCua}
                        gioDongCua={gioDongCua}
                        giaThueBuoiSang={giaThueBuoiSang}
                        giaThueBuoiToi={giaThueBuoiToi}
                        maSanChiTiet={maSanChiTiet}
                        onClose={onClose}
                        refetchBookedSlots={refetchBookedSlots}
                    />
                ) : (
                    <div className={styles.booking_container}>
                        <div className={styles.date_navigator}>
                            <Button
                                className={styles.nav_button}
                                onClick={() => navigateDates('prev')}
                                disabled={
                                    currentDateRange.start.toDateString() ===
                                    new Date().toDateString()
                                }
                                icon={<ChevronLeft size={16} />}
                            />
                            <p className={styles.date_range}>
                                {formatDateRange(
                                    currentDateRange.start,
                                    currentDateRange.end
                                )}
                            </p>
                            <Button
                                className={styles.nav_button}
                                onClick={() => navigateDates('next')}
                                disabled={(() => {
                                    const endDate = new Date(
                                        currentDateRange.end
                                    )
                                    endDate.setHours(0, 0, 0, 0)

                                    const maxDate = new Date()
                                    maxDate.setHours(0, 0, 0, 0)
                                    maxDate.setDate(maxDate.getDate() + 20)

                                    return endDate >= maxDate
                                })()}
                                icon={<ChevronRight size={16} />}
                            />
                        </div>
                        <div className={styles.time_frame_container}>
                            <div className={styles.time_frame_selector}>
                                <Button
                                    type="primary"
                                    shape="square"
                                    className={`${styles.time_frame_button} ${activeTimeFrame === 'morning' ? styles.active : ''}`}
                                    onClick={() =>
                                        setActiveTimeFrame('morning')
                                    }
                                >
                                    Khung sáng
                                </Button>
                                <Button
                                    type="primary"
                                    shape="square"
                                    className={`${styles.time_frame_button} ${activeTimeFrame === 'afternoon' ? styles.active : ''}`}
                                    onClick={() =>
                                        setActiveTimeFrame('afternoon')
                                    }
                                >
                                    Khung chiều
                                </Button>
                                <Button
                                    type="primary"
                                    shape="square"
                                    className={`${styles.time_frame_button} ${activeTimeFrame === 'evening' ? styles.active : ''}`}
                                    onClick={() =>
                                        setActiveTimeFrame('evening')
                                    }
                                >
                                    Khung tối
                                </Button>
                            </div>
                            <Button
                                type="primary"
                                shape="square"
                                onClick={handleOpenConfirm}
                                disabled={
                                    getAllSelectedSlots().length === 0 ||
                                    isBooking ||
                                    !defaultBookingTypeId
                                }
                                className={styles.book_button}
                            >
                                Đặt sân
                            </Button>
                        </div>
                        <ScheduleGrid
                            schedule={schedule}
                            selectedSlots={getCurrentFrameSlots()}
                            onSlotClick={handleSlotClick}
                        />
                    </div>
                )}
                <ModalConfirm
                    open={showConfirmModal}
                    onCancel={handleCancelConfirm}
                    onClickConfirm={handleConfirmBooking}
                    title="Xác nhận đặt sân"
                    description="Bạn có chắc chắn muốn đặt sân với các khung giờ đã chọn không? Vui lòng kiểm tra kỹ thông tin trước khi xác nhận."
                />
                <LoginModal
                    visible={showLoginModal}
                    onOk={() => setShowLoginModal(false)}
                    onCancel={() => setShowLoginModal(false)}
                />
                {isBooking && <Loading />}
            </div>
        </div>
    )
}

export default BookingModal

/**
 * Giải thích cách giữ trạng thái chọn slot khi chuyển giữa các khung giờ:
 *
 * - State `selectedSlotsByFrame` là một object gồm 3 mảng: morning, afternoon, evening.
 *   Mỗi mảng lưu các slot đã chọn của từng khung giờ riêng biệt.
 *
 * - Khi người dùng chọn slot ở khung nào, slot đó sẽ được lưu vào mảng tương ứng (theo key activeTimeFrame).
 *   Khi chuyển sang khung khác, chỉ các slot của khung đó mới được truyền xuống ScheduleGrid để hiển thị.
 *
 * - Khi quay lại khung trước, các slot đã chọn ở khung đó vẫn còn trong state, nên giao diện sẽ highlight lại đúng các slot đã chọn.
 *
 * - Khi đặt sân, sẽ gộp tất cả slot đã chọn ở cả 3 khung để gửi lên backend.
 *
 * => Cách này giúp mỗi khung giờ chỉ hiển thị slot đã chọn của chính nó, nhưng vẫn giữ được toàn bộ lựa chọn khi chuyển qua lại giữa các khung.
 */
