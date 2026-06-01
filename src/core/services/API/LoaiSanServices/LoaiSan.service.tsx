/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class LoaiSanService implements ILoaiSanService{
    async getAllLoaiSan(): Promise<any> {
        const res = await httpService.get('/loai-san')
        return res.data.data
    }
}

export const loaiSanService = new LoaiSanService()