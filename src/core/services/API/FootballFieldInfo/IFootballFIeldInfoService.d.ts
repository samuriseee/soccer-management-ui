/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
interface ICreateSanBongRequest {
    tenSan: string
    moTa: string
    diaChi: string
    quanHuyen: string
    phuongXa: string
    thanhPho: string
    gioMoCua: string
    gioDongCua: string
    media: File[]
}

interface IUpdateSanBongRequest {
    tenSan?: string
    moTa?: string
    diaChi?: string
    quanHuyen?: string
    phuongXa?: string
    thanhPho?: string
    gioMoCua?: string
    gioDongCua?: string
    media?: File[]
    mediaIdToRemove?: string[]
}

interface ISanBongFilterRequest {
    search?: string
    tenSan?: string
    diaChi?: string
    phuongXa?: string
    quanHuyen?: string
    viDo?: number
    kinhDo?: number
    page?: number
    limit?: number
}

interface IFootballFieldInfoService {
    createFootballFieldInfo(data: ICreateSanBongRequest): Promise<any>
    updateFootballFieldInfo(data: IUpdateSanBongRequest): Promise<any>
    getAllSanBong(filter: ISanBongFilterRequest): Promise<any>
}
