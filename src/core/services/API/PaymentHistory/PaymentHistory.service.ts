/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class PaymentHistoryService implements IPaymentHistoryService {
    async getAllDeposits(maNguoiDung: string, params?: IGetAllDepositsParams): Promise<any> {
        if (!maNguoiDung) return undefined
        const res = await httpService.get(
            `/lich-su-giao-dich/nap-tien/${maNguoiDung}`,
            { params }
        )
        return res.data.data
    }
}

export const paymentHistoryService = new PaymentHistoryService()