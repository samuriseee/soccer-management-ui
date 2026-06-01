/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './BookingCalendarView.module.scss'
import Button from '@/components/ui/Button/Button'

interface Booking {
    maChiTietDatSan: string
    hoTen: string
    tenSanChiTiet: string
    ngayDat: string
    gioBatDau: string
    gioKetThuc: string
    trangThaiDatSan: string
}

interface BookingCalendarViewProps {
    bookings: Booking[]
    onViewDetail: (booking: Booking) => void
}

const BookingCalendarView = ({
    bookings,
    onViewDetail,
}: BookingCalendarViewProps) => {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [calendarDays, setCalendarDays] = useState<Date[]>([])
    const [timeSlots, setTimeSlots] = useState<string[]>([])

    const MAX_FUTURE_WEEKS = 3

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const maxFutureDate = new Date(today)
    maxFutureDate.setDate(today.getDate() + MAX_FUTURE_WEEKS * 7)

    useEffect(() => {
        const slots = []
        for (let hour = 6; hour < 22; hour++) {
            const startHour = `${hour.toString().padStart(2, '0')}:00`
            const endHour = `${(hour + 1).toString().padStart(2, '0')}:00`
            slots.push(`${startHour} - ${endHour}`)
        }
        setTimeSlots(slots)
    }, [])

    useEffect(() => {
        const days = []
        const startOfWeek = new Date(currentDate)
        const dayOfWeek = startOfWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfWeek.setDate(startOfWeek.getDate() + diff)
        startOfWeek.setHours(0, 0, 0, 0)

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)
            days.push(day)
        }
        setCalendarDays(days)
    }, [currentDate])

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() - 7)

        const startOfNewWeek = new Date(newDate)
        const dayOfWeek = startOfNewWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfNewWeek.setDate(startOfNewWeek.getDate() + diff)
        startOfNewWeek.setHours(0, 0, 0, 0)

        if (startOfNewWeek >= today) {
            setCurrentDate(newDate)
        }
    }

    const goToNextWeek = () => {
        const newDate = new Date(currentDate)
        newDate.setDate(currentDate.getDate() + 7)

        const startOfNewWeek = new Date(newDate)
        const dayOfWeek = startOfNewWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfNewWeek.setDate(startOfNewWeek.getDate() + diff)
        startOfNewWeek.setHours(0, 0, 0, 0)

        if (startOfNewWeek <= maxFutureDate) {
            setCurrentDate(newDate)
        }
    }

    const goToToday = () => {
        setCurrentDate(new Date())
    }

    const canGoToPreviousWeek = () => {
        const startOfCurrentWeek = new Date(currentDate)
        const dayOfWeek = startOfCurrentWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + diff)
        startOfCurrentWeek.setHours(0, 0, 0, 0)

        const startOfPreviousWeek = new Date(startOfCurrentWeek)
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7)

        return startOfPreviousWeek >= today
    }

    const canGoToNextWeek = () => {
        const startOfCurrentWeek = new Date(currentDate)
        const dayOfWeek = startOfCurrentWeek.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startOfCurrentWeek.setDate(startOfCurrentWeek.getDate() + diff)
        startOfCurrentWeek.setHours(0, 0, 0, 0)

        const startOfNextWeek = new Date(startOfCurrentWeek)
        startOfNextWeek.setDate(startOfCurrentWeek.getDate() + 7)

        return startOfNextWeek <= maxFutureDate
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('vi-VN', {
            day: 'numeric',
            month: 'numeric',
        }).format(date)
    }

    const getDayName = (date: Date) => {
        const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
        return days[date.getDay()]
    }

    const isToday = (date: Date) => {
        const today = new Date()
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        )
    }

    const getBookingsForDateAndTime = (date: Date, slot: string) => {
        const dateString = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

        return bookings.filter((booking) => {
            const bookingDate = booking.ngayDat
            const bookingSlot = `${booking.gioBatDau} - ${booking.gioKetThuc}`
            return bookingDate === dateString && bookingSlot === slot
        })
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'confirmed':
                return styles.status_confirmed
            case 'pending':
                return styles.status_pending
            case 'cancelled':
                return styles.status_cancelled
            default:
                return ''
        }
    }

    const startOfWeek = new Date(calendarDays[0] || currentDate)
    const endOfWeek = new Date(calendarDays[6] || currentDate)
    const weekRangeText = `${startOfWeek.getDate()}/${startOfWeek.getMonth() + 1} - ${endOfWeek.getDate()}/${endOfWeek.getMonth() + 1}/${endOfWeek.getFullYear()}`

    return (
        <div className={styles.calendar_view}>
            <div className={styles.calendar_header}>
                <div className={styles.calendar_navigation}>
                    <Button
                        type="default"
                        shape="circle"
                        onClick={goToPreviousWeek}
                        disabled={!canGoToPreviousWeek()}
                        icon={<ChevronLeft size={16} />}
                    />
                    <Button
                        type="default"
                        shape="square"
                        onClick={goToToday}
                        className={styles.today_button}
                    >
                        Hôm nay
                    </Button>
                    <Button
                        type="default"
                        shape="circle"
                        onClick={goToNextWeek}
                        disabled={!canGoToNextWeek()}
                        icon={<ChevronRight size={16} />}
                    />
                </div>
                <h2 className={styles.calendar_title}>Tuần {weekRangeText}</h2>
            </div>

            <div className={styles.calendar_container}>
                <div className={styles.time_column}>
                    <div className={styles.day_header}></div>
                    {timeSlots.map((slot, index) => (
                        <div key={index} className={styles.time_slot}>
                            {slot}
                        </div>
                    ))}
                </div>

                <div className={styles.days_grid}>
                    {calendarDays.map((day, dayIndex) => (
                        <div key={dayIndex} className={styles.day_column}>
                            <div
                                className={`${styles.day_header} ${
                                    isToday(day) ? styles.today : ''
                                }`}
                            >
                                <div className={styles.day_name}>
                                    {getDayName(day)}
                                </div>
                                <div className={styles.day_date}>
                                    {formatDate(day)}
                                </div>
                            </div>

                            {timeSlots.map((slot, slotIndex) => {
                                const bookingsForSlot =
                                    getBookingsForDateAndTime(day, slot)
                                return (
                                    <div
                                        key={slotIndex}
                                        className={styles.calendar_cell}
                                    >
                                        {bookingsForSlot.length > 0 ? (
                                            bookingsForSlot.map((booking) => (
                                                <div
                                                    key={
                                                        booking.maChiTietDatSan
                                                    }
                                                    className={`${styles.booking_item} ${getStatusClass(
                                                        booking.trangThaiDatSan
                                                    )}`}
                                                    onClick={() =>
                                                        onViewDetail(booking)
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles.booking_field
                                                        }
                                                    >
                                                        {booking.tenSanChiTiet}
                                                    </div>
                                                    <div
                                                        className={
                                                            styles.booking_customer
                                                        }
                                                    >
                                                        {booking.hoTen}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className={styles.empty_slot}
                                            ></div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookingCalendarView
