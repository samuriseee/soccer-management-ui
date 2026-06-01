/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface ISanBongFilterRequest {
    search?: string
    tenSan?: string
    diaChi?: string
    phuongXa?: string
    quanHuyen?: string
    daDuyet?: string
    page?: number
    limit?: number
}

interface IAdminService {
    getAllSanBongForAdmin(filter: ISanBongFilterRequest): Promise<any>
}