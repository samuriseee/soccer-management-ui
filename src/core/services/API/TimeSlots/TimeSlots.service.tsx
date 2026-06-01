/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from '@/core/config/httpService'

class TimeSlotsService implements ITimeSlotsSerivce {
    async createDatSan(data: CreateDatSanRequest): Promise<any> {
        if (!data?.maSanChiTiet) {
            return undefined
        }
        const res = await httpService.post('/dat-san', data)
        return res.data
    }

    async getBookedSlots(params: GetBookedSlotsParams): Promise<BookedSlot[]> {
        const res = await httpService.get('/dat-san/booked-slots', { params })
        return res.data.data
    }

    async getAllLichSuDatSanNguoiThue(
        params?: IGetAllLichSuDatSanNguoiThue
    ): Promise<any> {
        const res = await httpService.get(`/dat-san/lich-su`, { params })
        return res.data.data
    }

    async cancelDatSan(data: { maDatSan: string }): Promise<any> {
        if (!data?.maDatSan) return undefined
        const res = await httpService.post(`/dat-san/huy-dat-san`, data)
        return res.data
    }

    async getSlotsByChuSan(params: IGetSlotsByChuSanParams): Promise<any> {
        const res = await httpService.get('/dat-san/chu-san/slots', { params })
        return res.data.data
    }

    async getDashboardReportByChuSan(
        params: IGetDashboardReportByChuSan
    ): Promise<any> {
        const res = await httpService.get('/dat-san/chu-san/dashboard-report', {
            params,
        })
        return res.data.data
    }

    async getAllSlotsForAdmin(
        params?: IGetAllSlotsForAdminParams
    ): Promise<any> {
        const res = await httpService.get(`/dat-san/admin/slots`, { params })
        return res.data.data
    }

    async setCoVanDeForSlot(data: ISetCoVanDeForSlotRequest): Promise<any> {
        if (!data?.maChiTietDatSan) return undefined
        const res = await httpService.patch(
            `/dat-san/admin/slot/${data.maChiTietDatSan}/co-van-de`,
            { coVanDe: data.coVanDe }
        )
        return res.data
    }

    async createMonthlyBooking(data: CreateMonthlyBookingRequest): Promise<any> {
        if (!data?.maSanChiTiet || !data?.maLoaiDat) {
            return undefined
        }
        const res = await httpService.post('/dat-san/dat-san-theo-thang', data)
        return res.data
    }
}

export const timeSlotsService = new TimeSlotsService()
