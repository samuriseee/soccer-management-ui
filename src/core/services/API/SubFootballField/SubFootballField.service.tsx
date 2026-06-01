/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class SubFootballFieldService implements ISubFootballFieldService {
    async createSubFootballField(
        maSanBong: string,
        data: ICreateSubFootballFieldRequest
    ): Promise<any> {
        const formData = new FormData()
        formData.append('tenSanChiTiet', data.tenSanChiTiet)
        formData.append('maLoaiSan', data.maLoaiSan)
        formData.append('giaThueBuoiSang', data.giaThueBuoiSang.toString())
        formData.append('giaThueBuoiToi', data.giaThueBuoiToi.toString())

        if (data.hinhAnh) {
            formData.append('hinhAnh', data.hinhAnh)
        }

        const res = await httpService.post(
            `/san-bong-chi-tiet/${maSanBong}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        return res.data
    }

    async updateSubFootballField(
        maSanChiTiet: string,
        data: IUpdateSubFootballFieldRequest
    ): Promise<any> {
        const formData = new FormData()
        if (data.tenSanChiTiet)
            formData.append('tenSanChiTiet', data.tenSanChiTiet)
        if (data.maLoaiSan) formData.append('maLoaiSan', data.maLoaiSan)
        if (data.giaThueBuoiSang !== undefined) {
            formData.append('giaThueBuoiSang', data.giaThueBuoiSang.toString())
        }

        if (data.giaThueBuoiToi !== undefined) {
            formData.append('giaThueBuoiToi', data.giaThueBuoiToi.toString())
        }

        if (data.hinhAnh) {
            formData.append('hinhAnh', data.hinhAnh)
        }

        const res = await httpService.put(
            `/san-bong-chi-tiet/${maSanChiTiet}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )

        return res.data
    }

    async getAllSubFootballField(
        maSanBong: string,
        query: IGetAllSubFootballFieldQuery = {}
    ): Promise<any> {
        const params = {
            tenSanChiTiet: query.tenSanChiTiet,
            maLoaiSan: query.maLoaiSan,
            page: query.page ?? 1,
            limit: query.limit ?? 10,
        }

        const res = await httpService.get(
            `/san-bong-chi-tiet/all/${maSanBong}`,
            {
                params,
            }
        )
        return res.data.data
    }

    async getOneSubFootballField(maSanChiTiet: string): Promise<any> {
        const res = await httpService.get(`/san-bong-chi-tiet/${maSanChiTiet}`)

        return res.data.data
    }

    async deleteSubFootballField(maSanChiTiet: string): Promise<any> {
        const res = await httpService.delete(
            `/san-bong-chi-tiet/${maSanChiTiet}`
        )
        return res.data
    }
}

export const subFootballFieldService = new SubFootballFieldService()
