/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class LoaiHinhDatService implements ILoaiHinhDatService {
    async getAllLoaiHinhDat(): Promise<any> {
        const res = await httpService.get('/loai-hinh-dat')
        return res.data.data
    }
}

export const loaiHinhDatService = new LoaiHinhDatService()