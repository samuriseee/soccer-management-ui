/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

/**
 * Chuyển đổi số thành chuỗi có định dạng tiền tệ với dấu chấm phân cách
 * @param value Giá trị số cần định dạng
 * @returns Chuỗi đã được định dạng với dấu chấm phân cách
 */
export const formatCurrency = (value: number | string): string => {
    if (!value && value !== 0) return ''

    // Chuyển đổi thành chuỗi và loại bỏ các ký tự không phải số
    const numericValue = value.toString().replace(/[^0-9]/g, '')

    // Định dạng với dấu chấm phân cách hàng nghìn
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Chuyển đổi chuỗi tiền tệ có định dạng thành số
 * @param formattedValue Chuỗi tiền tệ có định dạng
 * @returns Giá trị số
 */
export const parseCurrency = (formattedValue: string): number => {
    if (!formattedValue) return 0

    // Loại bỏ tất cả các ký tự không phải số
    const numericValue = formattedValue.replace(/[^0-9]/g, '')

    return numericValue ? Number(numericValue) : 0
}

/**
 * Định dạng giá trị tiền tệ khi người dùng nhập
 * @param inputValue Giá trị người dùng nhập vào
 * @returns Giá trị đã được định dạng để hiển thị
 */
export const formatCurrencyInput = (inputValue: string): string => {
    // Loại bỏ tất cả các ký tự không phải số
    const numericValue = inputValue.replace(/[^0-9]/g, '')

    // Định dạng với dấu chấm phân cách hàng nghìn
    return formatCurrency(numericValue)
}
