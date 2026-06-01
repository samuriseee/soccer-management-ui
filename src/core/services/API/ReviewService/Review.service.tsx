/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from "@/core/config/httpService";

class ReviewService implements IReviewService {
    async createReview(data: ICreateReviewRequest): Promise<any> {
        const { sanBongId, diemSo, binhLuan } = data;
        if (!sanBongId || !diemSo) {
            return undefined;
        }
        const res = await httpService.post('/danh-gia', {
            sanBongId,
            diemSo,
            binhLuan,
        })
        return res.data;
    }

    async getReviews(maSanBong: string, params?: IGetReviewsParams): Promise<any> {
        if (!maSanBong) {
            return undefined;
        }
        const res = await httpService.get(`/danh-gia/${maSanBong}`, { params })
        return res.data.data;
    }
}

export const reviewService = new ReviewService()