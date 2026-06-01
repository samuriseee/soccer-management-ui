/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

// Chuyển chuỗi thời gian (HH:MM) thành số phút
// Parse opening and closing hours
export const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
}

// Chuyển số phút thành chuỗi thời gian (HH:MM)
export const formatMinutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

// Lấy tên ngày (CN, T2, ...) từ số ngày trong tuần
export const getDayName = (day: number): string => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    return days[day]
}

// Định dạng chuỗi khoảng ngày (e.g., "Từ ngày 14/4 đến ngày 20/4")
export const formatDateRange = (start: Date, end: Date): string => {
    return `Từ ngày ${start.getDate()}/${start.getMonth() + 1} đến ngày ${end.getDate()}/${end.getMonth() + 1}`
}

// Generate time slots based on opening and closing hours
// Tạo danh sách slot thời gian dựa trên giờ mở/đóng và khung sáng/chiều
export const generateTimeSlots = (
    isHalfHour: boolean,
    openingMinutes: number,
    closingMinutes: number,
    timeFrame: 'morning' | 'afternoon' | 'evening',
    giaThueBuoiSang: number,
    giaThueBuoiToi: number
): Array<{ startTime: string; endTime: string; price: number }> => {
    const slots: { startTime: string; endTime: string; price: number }[] = []
    const slotDuration = 60 // 1 hour slots

    // Tính toán mốc kết thúc động dựa trên phút mở cửa
    // Nếu mở cửa 05:30 thì sáng: 05:30-12:30, chiều: 12:30-17:30, tối: 17:30-giờ đóng cửa
    const morningEnd = 12 * 60 + (openingMinutes % 60) // 12:00 hoặc 12:30
    const afternoonStart = morningEnd
    const afternoonEnd = 17 * 60 + (openingMinutes % 60) // 17:00 hoặc 17:30
    const eveningStart = afternoonEnd
    const eveningEnd = closingMinutes

    let startMinute = openingMinutes
    let endMinute = morningEnd

    if (timeFrame === 'morning') {
        startMinute = openingMinutes
        endMinute = morningEnd
    } else if (timeFrame === 'afternoon') {
        startMinute = afternoonStart
        endMinute = afternoonEnd
    } else if (timeFrame === 'evening') {
        startMinute = eveningStart
        endMinute = eveningEnd
    }

    let currentMinute = startMinute
    while (currentMinute + slotDuration <= endMinute) {
        const startTime = formatMinutesToTime(currentMinute)
        const endTime = formatMinutesToTime(currentMinute + slotDuration)

        // Nếu giờ bắt đầu là lẻ (:30) thì giá buổi tối áp dụng từ 17:30, còn nếu tròn giờ thì từ 17:00
        let eveningThreshold = 17 * 60
        if (openingMinutes % 60 === 30) {
            eveningThreshold = 17 * 60 + 30 // 17:30
        }

        const price =
            currentMinute >= eveningThreshold
                ? giaThueBuoiToi
                : giaThueBuoiSang

        slots.push({
            startTime,
            endTime,
            price,
        })

        currentMinute += slotDuration
    }

    return slots
}
