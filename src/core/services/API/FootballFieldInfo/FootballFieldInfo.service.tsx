/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from '@/core/config/httpService'

class FootballFieldInfoService implements IFootballFieldInfoService {
    async getFootballFieldInfo(): Promise<any> {
        const res = await httpService.get('/san-bong/me')
        return res.data.data
    }

    async createFootballFieldInfo(data: ICreateSanBongRequest): Promise<any> {
        const formData = new FormData()
        formData.append('tenSan', data.tenSan)
        formData.append('moTa', data.moTa)
        formData.append('diaChi', data.diaChi)
        formData.append('quanHuyen', data.quanHuyen)
        formData.append('phuongXa', data.phuongXa)
        formData.append('thanhPho', data.thanhPho)
        formData.append('gioMoCua', data.gioMoCua)
        formData.append('gioDongCua', data.gioDongCua)

        for (let i = 0; i < data.media.length; i++) {
            formData.append('media[]', data.media[i])
        }

        const res = await httpService.post('/san-bong', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    }

    async updateFootballFieldInfo(data: IUpdateSanBongRequest): Promise<any> {
        const formData = new FormData()
        if (data.tenSan) formData.append('tenSan', data.tenSan)
        if (data.moTa) formData.append('moTa', data.moTa)
        if (data.diaChi) formData.append('diaChi', data.diaChi)
        if (data.quanHuyen) formData.append('quanHuyen', data.quanHuyen)
        if (data.phuongXa) formData.append('phuongXa', data.phuongXa)
        if (data.thanhPho) formData.append('thanhPho', data.thanhPho)
        if (data.gioMoCua) formData.append('gioMoCua', data.gioMoCua)
        if (data.gioDongCua) formData.append('gioDongCua', data.gioDongCua)

        if (data.media && data.media.length > 0) {
            for (let i = 0; i < data.media.length; i++) {
                formData.append('media[]', data.media[i])
            }
        }

        // Đảm bảo luôn gửi lên trường này nếu có (kể cả mảng rỗng)
        if (data.mediaIdToRemove) {
            for (let i = 0; i < data.mediaIdToRemove.length; i++) {
                formData.append('mediaIdToRemove[]', data.mediaIdToRemove[i])
            }
        }

        const res = await httpService.put('/san-bong', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return res.data
    }

    async getAllSanBong(filter: ISanBongFilterRequest): Promise<any> {
        const res = await httpService.get(`/san-bong/`, { params: filter })
        return res.data.data
    }

    async getOneSanBong(maSanBong: string): Promise<any> {
        if (!maSanBong) return undefined
        const res = await httpService.get(`/san-bong/${maSanBong}`)

        return res.data.data
    }
}

export const fooballFieldInfoService = new FootballFieldInfoService()
