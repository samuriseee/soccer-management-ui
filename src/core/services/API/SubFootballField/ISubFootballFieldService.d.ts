/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface ICreateSubFootballFieldRequest {
    tenSanChiTiet: string
    maLoaiSan: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    hinhAnh: File
}

interface IUpdateSubFootballFieldRequest {
    tenSanChiTiet?: string
    maLoaiSan?: string
    giaThueBuoiSang?: number
    giaThueBuoiToi?: number
    hinhAnh?: File
}

interface IGetAllSubFootballFieldQuery {
    tenSanChiTiet?: string
    maLoaiSan?: string
    page?: number
    limit?: number
}

interface ISubFootballFieldService {
    createSubFootballField(
        maSanBong: string,
        data: ICreateSubFootballFieldRequest
    ): Promise<any>
    updateSubFootballField(
        maSanChiTiet: string,
        data: IUpdateSubFootballFieldRequest
    ): Promise<any>
    getAllSubFootballField(
        maSanBong: string,
        query?: IGetAllSubFootballFieldQuery
    ): Promise<any>
    deleteSubFootballField(maSanChiTiet: string): Promise<any>
}