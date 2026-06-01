/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService";

class ReportService implements IReportService {
    async createReport(data: ICreateReportRequest): Promise<any> { 
        const res = await httpService.post('/bao-cao/', data)
        return res.data
    }

    async getAllReports(params: IGetAllReportsParams): Promise<any> {
        const { page = 1, limit = 10, search = '', fromDate = '', toDate = '' } = params;
        const res = await httpService.get('/bao-cao/all', {
            params: {
                page,
                limit,
                search,
                fromDate,
                toDate
            }
        });
        return res.data.data;
    }
}

export const reportService = new ReportService();