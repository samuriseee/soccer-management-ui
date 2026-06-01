/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface ICreateReportRequest {
    sanBongId: string
    lyDo: string
}

interface IGetAllReportsParams {
    page?: number
    limit?: number
    search?: string
    fromDate?: string
    toDate?: string
}
interface IReportService {
    createReport(data: ICreateReportRequest): Promise<any>
    getAllReports(params: IGetAllReportsParams): Promise<any>
}