/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import axios from 'axios'
import { localStorageService } from '../services/LocalStorage.service'
import { AppConfig } from './appConfig'

const API_URL: string =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const httpService = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
    withCredentials: true, // để gửi cookie đi
})

httpService.interceptors.request.use(
    async (config: any) => {
        const token: string | null = await localStorageService.getToken()
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        const locale = window.location.pathname.split('/')[1]
        const { locales } = AppConfig
        const currentLocale = locales.includes(locale) ? locale : 'vi'
        config.headers['Accept-Language'] = currentLocale

        return config
    },
    (error) => Promise.reject(error)
)

httpService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true
            try {
                console.log('Đang gọi refresh-token...')
                
                const { data } = await axios.post(
                    `${API_URL}/api/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                )
                localStorageService.setToken(data.data.access_token)
                originalRequest.headers['Authorization'] =
                    `Bearer ${data.data.access_token}`
                return httpService(originalRequest)
            } catch (refreshError) {
                localStorageService.removeToken()
                window.location.href = '/vi/account/sign-in' // hoặc điều hướng sang login page
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default httpService
