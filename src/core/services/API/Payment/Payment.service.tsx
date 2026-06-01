/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService"

class PaymentService implements IPaymentService {
    async createPaymentUrl(amount: number): Promise<any> {
        const res = await httpService.post('/payment/create-payment-url', {
            amount,
        })

        return res.data
    }
}

export const paymentService = new PaymentService()