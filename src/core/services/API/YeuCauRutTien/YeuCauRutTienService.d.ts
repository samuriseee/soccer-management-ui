/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface IYeuCauRutTienRequest {
    soTien: number
    tenNganHang: string
    soTaiKhoan: string
    moTa?: string
}

interface IGetAllYeuCauRutTienRequest {
    page?: number
    limit?: number
    search?: string
    trangThai?: string
    fromDate?: string
    toDate?: string
}

interface IYeuCauRutTienService {
    createYeuCauRutTien(data: IYeuCauRutTienRequest): Promise<any>
    getAllYeuCauRutTien(request: IGetAllYeuCauRutTienRequest): Promise<any>
}