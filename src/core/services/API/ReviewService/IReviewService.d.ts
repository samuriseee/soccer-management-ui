/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface ICreateReviewRequest {
    sanBongId: string;
    diemSo: number;
    binhLuan?: string;
}

interface IGetReviewsParams {
    page?: number
    limit?: number
}

interface IReviewService  {
    createReview(data: ICreateReviewRequest): Promise<any>;
    getReviews(maSanBong: string, params?: IGetReviewsParams): Promise<any>;
}