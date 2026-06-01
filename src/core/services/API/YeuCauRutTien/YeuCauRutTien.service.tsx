/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from '@/core/config/httpService'

class YeuCauRutTienService implements IYeuCauRutTienService {
    async getSoDuTaiKhoan(): Promise<any> {
        const res = await httpService.get('/yeu-cau-rut-tien/so-du')
        return res.data.data
    }

    async createYeuCauRutTien(data: IYeuCauRutTienRequest): Promise<any> {
        const res = await httpService.post('/yeu-cau-rut-tien/create', data)
        return res.data
    }

    async getAllYeuCauRutTien(
        request: IGetAllYeuCauRutTienRequest
    ): Promise<any> {
        const params: any = {
            page: request.page,
            limit: request.limit,
        }
        if (request.search) params.search = request.search
        if (request.trangThai) params.trangThai = request.trangThai
        if (request.fromDate) params.fromDate = request.fromDate
        if (request.toDate) params.toDate = request.toDate
        const res = await httpService.get('/yeu-cau-rut-tien/all', { params })
        return res.data.data
    }

    async approveYeuCauRutTien(maYeuCau: string): Promise<any> {
        const res = await httpService.post(
            '/yeu-cau-rut-tien/complete',
            { maYeuCau }
        )
        return res.data
    }
}

export const yeuCauRutTienService = new YeuCauRutTienService()
