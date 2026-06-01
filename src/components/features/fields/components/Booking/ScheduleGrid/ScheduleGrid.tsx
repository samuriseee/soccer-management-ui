/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import type React from 'react'
import { useRef } from 'react'
import styles from './ScheduleGrid.module.scss'

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

interface ScheduleGridProps {
    schedule: DaySchedule[]
    selectedSlots: Array<{ day: DaySchedule; slot: TimeSlot }>
    onSlotClick: (day: DaySchedule, slot: TimeSlot) => void
    isSlotSelected?: (day: DaySchedule, slot: TimeSlot) => boolean
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({
    schedule,
    selectedSlots,
    onSlotClick,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Tạo map các slot đã chọn theo id để so sánh nhanh
    const selectedSlotIds = new Set(
        selectedSlots.map((s) => `${s.day.date.getTime()}-${s.slot.id}`)
    )

    return (
        <div className={styles.schedule_container}>
            <div className={styles.day_info_column}>
                <div className={styles.day_info_header}>
                    <p className={styles.day_info_cell}>Ngày</p>
                </div>
                <div className={styles.day_info_body}>
                    {schedule.map((day) => (
                        <div
                            key={`day-${day.dayName}-${day.dayNumber}`}
                            className={styles.day_info}
                        >
                            <p className={styles.day_name}>{day.dayName}</p>
                            <p className={styles.day_number}>
                                {day.dayNumber}/{day.month}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.time_slots_column} ref={scrollContainerRef}>
                {schedule.length > 0 && schedule[0].slots.length > 0 && (
                    <div className={styles.time_slots_header}>
                        {schedule[0].slots.map((slot) => (
                            <div
                                key={slot.fullTime}
                                className={styles.time_slot_header}
                            >
                                {slot.fullTime}
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles.time_slots_body}>
                    {schedule.map((day) => (
                        <div
                            key={`slots-${day.dayName}-${day.dayNumber}`}
                            className={styles.day_slots}
                        >
                            {day.slots.map((slot) => {
                                // Chỉ highlight slot nếu nó thuộc schedule hiện tại (ngày và id slot trùng)
                                const isSelected = selectedSlotIds.has(
                                    `${day.date.getTime()}-${slot.id}`
                                )
                                return (
                                    <div
                                        key={slot.id}
                                        className={`${styles.time_slot} ${
                                            slot.isExpired
                                                ? styles.expired
                                                : slot.isAvailable
                                                  ? styles.available
                                                  : styles.booked
                                        } ${isSelected ? styles.selected : ''}`}
                                        onClick={() => onSlotClick(day, slot)}
                                    >
                                        {slot.isExpired ? (
                                            <span
                                                className={styles.expired_text}
                                            >
                                                Hết hạn
                                            </span>
                                        ) : !slot.isAvailable ? (
                                            <span
                                                className={styles.booked_text}
                                            >
                                                Đã có người đặt
                                            </span>
                                        ) : (
                                            <span className={styles.price}>
                                                {slot.price.toLocaleString(
                                                    'vi-VN'
                                                )}{' '}
                                                đ
                                            </span>
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

export default ScheduleGrid
