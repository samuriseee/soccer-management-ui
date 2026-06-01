/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */


interface IInforUser {
    dateOfBirth?: string
    gender?: string
    name?: string
    phone?: string
    country?: string
    city?: string
    avatar?: any
    action?: string
    prefer_language?: string
}

interface ISignupEmailRequest {
    hoTen: string
    email: string
    soDienThoai: string
    vaiTro: "nguoiThue" | "chuSan"
}

interface IResendEmailRequest {
    email: string
    type: string
}

interface IVerifySignupEmailRequest {
    email?: string
    maXacThuc: string
}

interface ISetPasswordRequest {
    email?: string
    maXacThuc: string
    matKhau: string
}

interface ISignInRequest {
    email: string
    matKhau: string
    // isRemember: boolean
}

interface ISignUpGoogleRequest {
    accessToken: string
    user: {
        email: string
        name?: string
        picture?: string
        sub?: string
    }
    vaiTro?: 'nguoiThue' | 'chuSan'
}

interface IForgotPasswordRequest {
    email: string
    type: string
}

interface IAuthentication {
    signupEmail({ request }: ISignupEmailRequest): Promise<any>
    signIn({ request }: ISignInRequest): Promise<any>
    resendEmail({ email, type }: IResendEmailRequest): Promise<any>
    verifySignupEmail({ email, token }: IVerifySignupEmailRequest): Promise<any>
    setPassword({ email, token, password }: ISetPasswordRequest): Promise<any>
}
