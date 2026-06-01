/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface IGetAllDepositsParams {
    page?: number
    limit?: number
}

interface IPaymentHistoryService {
    getAllDeposits(
        maNguoiDung: string,
        params?: IGetAllDepositsParams
    ): Promise<any>
}
