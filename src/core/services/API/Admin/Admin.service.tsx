/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class AdminService implements IAdminService {
    async getAllSanBongForAdmin(filter: ISanBongFilterRequest): Promise<any> {
        const res = await httpService.get(`/admin/all-san-bong/`, {
            params: filter,
        })
        return res.data.data
    }

    async approveSanBong(maSanBong: string): Promise<any> {
        const res = await httpService.put(`/admin/${maSanBong}/approve`)

        return res.data
    }

    async disiableSanBong(maSanBong: string): Promise<any> {
        const res = await httpService.put(`/admin/${maSanBong}/disable`)

        return res.data
    }
}

export const adminService = new AdminService()