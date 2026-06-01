/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

export const WEEK_DAYS = [
    { label: 'Thứ 2', value: 1 },
    { label: 'Thứ 3', value: 2 },
    { label: 'Thứ 4', value: 3 },
    { label: 'Thứ 5', value: 4 },
    { label: 'Thứ 6', value: 5 },
    { label: 'Thứ 7', value: 6 },
    { label: 'Chủ nhật', value: 0 },
]

export const parseTimeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + (m || 0)
}

export const formatMinutesToTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export const DISCOUNT_MAP = [
    { min: 2, max: 2, percent: 5 },
    { min: 3, max: 3, percent: 7 },
    { min: 4, max: 4, percent: 10 },
    { min: 5, max: 5, percent: 12 },
    { min: 6, max: 6, percent: 14 },
    { min: 7, max: 7, percent: 15 },
]
