/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface LichDatItem {
    ngayDat: string // "YYYY-MM-DD"
    gioBatDau: string // "HH:MM"
    gioKetThuc: string // "HH:MM"
}

interface CreateDatSanRequest {
    maSanChiTiet: string
    maLoaiDat: string
    soTien: number
    lichDat: LichDatItem[]
}

interface GetBookedSlotsParams {
    maSanChiTiet: string
    fromDate: string // "YYYY-MM-DD"
    toDate: string // "YYYY-MM-DD"
}

interface BookedSlot {
    ngayDat: string // "YYYY-MM-DD"
    gioBatDau: string // "HH:MM"
    gioKetThuc: string // "HH:MM"
}

interface IGetAllLichSuDatSanNguoiThue {
    page?: number
    limit?: number
}
interface IGetSlotsByChuSanParams {
    page?: number
    limit?: number
    ngayDat?: string
    trangThaiDatSan?: string
    search?: string
}

interface IGetDashboardReportByChuSan {
    range: 'month' | 'quarter' | 'year'
    year?: number
}

interface IGetAllSlotsForAdminParams {
    page?: number
    limit?: number
    ngayDat?: string
    trangThaiDatSan?: string
    search?: string
}

interface ISetCoVanDeForSlotRequest {
    maChiTietDatSan: string
    coVanDe: boolean
}

interface CreateMonthlyBookingRequest {
    maSanChiTiet: string;
    maLoaiDat: string;
    ngayBatDau: string; // YYYY-MM-DD
    ngayKetThuc: string; // YYYY-MM-DD
    gioBatDau: string; // HH:MM
    gioKetThuc: string; // HH:MM
    thuTrongTuan: number[];
}

interface ITimeSlotsSerivce {
    createDatSan(data: CreateDatSanRequest): Promise<any>
    getBookedSlots(params: GetBookedSlotsParams): Promise<BookedSlot[]>
    getAllLichSuDatSanNguoiThue(
        params?: IGetAllLichSuDatSanNguoiThue
    ): Promise<any>
    cancelDatSan(data: { maDatSan: string }): Promise<any>
    getSlotsByChuSan(params: IGetSlotsByChuSanParams): Promise<any>
    getDashboardReportByChuSan(
        params: IGetDashboardReportByChuSan
    ): Promise<any>
    getAllSlotsForAdmin(params?: IGetAllSlotsForAdminParams): Promise<any>
    setCoVanDeForSlot(data: ISetCoVanDeForSlotRequest): Promise<any>
    createMonthlyBooking(data: CreateMonthlyBookingRequest): Promise<any>;
}
