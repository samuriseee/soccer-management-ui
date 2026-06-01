/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

// define common contants
export const NAVIGATION_PATHS = {
    HOME: '/',
    PRIVACY: '#',
    SIGN_UP: '/account/sign-up',
    SIGN_UP_CHU_SAN: '/account/sign-up/chu-san',
    SING_UP_NGUOI_THUE: '/account/sign-up/nguoi-thue',
    SIGN_IN: '/account/sign-in',
    FORGOT_PASSWORD: '/account/forgot-password',
    FIELD_LIST: '/fields',
    CHECK_EMAIL_SIGNUP: '/account/check-email-signup',
    VERIFY_EMAIL_FAILED: '/auth/verify-email-failed',
    SET_PASSWORD: '/account/set-password',
    DASH_BOARD_CHU_SAN: '/auth/chu-san/dash-board',
    DASH_BOARD_NGUOI_THUE: '/auth/nguoi-thue/dash-board',
    DASH_BOARD_ADMIN: '/auth/admin/dash-board',
    ABOUT: '/about',
    SUPPORT: '/support',
}

export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/

export const FORMAT_DATE_TIME = {
    DATE_DEFAULT: 'dd/MM/yyyy',
    DATE_FORMAT_SECOND: 'YYYY-MM-DD',
    DATE_TIME_FULL: 'h:mma - dd/MM/yyyy',
}
