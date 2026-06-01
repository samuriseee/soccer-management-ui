/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

export interface FieldDetailFromApi {
    maSanChiTiet: string
    maSanBong: string
    tenSanChiTiet: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    tenLoaiSan: string
    maLoaiSan: string
    media: {
        link: string
    }[]
}

export interface FieldFormData {
    maSanChiTiet?: string
    maSanBong: string
    tenSanChiTiet: string
    maLoaiSan: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    hinhAnh: File | null
}

export interface FieldType {
    maLoaiSan: string
    tenLoaiSan: string
}