/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import httpService from '@/core/config/httpService'
import { getFingerprint } from '@/helper/utils'
import { localStorageService } from '../../LocalStorage.service'

class AuthenticationService implements IAuthentication {
    async signupEmail(request: ISignupEmailRequest): Promise<any> {
        const data = {
            hoTen: request.hoTen,
            email: request.email,
            soDienThoai: request.soDienThoai,
            vaiTro: request.vaiTro,
        }
        const res = await httpService.post('/auth/signup', data)
        return res
    }

    async resendEmail({ email, type }: IResendEmailRequest): Promise<any> {
        const data: { email: string; type: string } = { email, type }
        const res = await httpService.post('/auth/resend-email', data)
        return res
    }

    async verifySignupEmail({
        // email,
        maXacThuc,
    }: IVerifySignupEmailRequest): Promise<any> {
        const data: { maXacThuc: string } = { maXacThuc }
        const res = await httpService.post('/auth/verify-email', data)
        return res.data
    }

    async setPassword({
        // email,
        maXacThuc,
        matKhau,
    }: ISetPasswordRequest): Promise<any> {
        // const deviceID = await getFingerprint()
        const data: { maXacThuc: string; matKhau: string } = {
            maXacThuc,
            matKhau,
        }
        // const headers = {
        //     'Device-ID': deviceID,
        // }
        const res = await httpService.post('/auth/set-password', data)
        console.log("res", res.data);
        return res.data     
    }

    async signIn(request: ISignInRequest): Promise<any> {
        // const deviceID = await getFingerprint()
        const data = {
            email: request.email,
            matKhau: request.matKhau,
        }

        // const headers = {
        //     'Device-ID': deviceID,
        // }
        const res = await httpService.post('/auth/signin', data)
        return res.data
    }

    async signUpGoogle(request: ISignUpGoogleRequest): Promise<any> {
        const data = {
            accessToken: request.accessToken,
            user: request.user,
            vaiTro: request.vaiTro,
        }

        const res = await httpService.post('/auth/google-auth', data)
        return res.data
    }

    async logoutUser(): Promise<any> {
        const token = localStorageService.getToken()
        if (token) {
            const res = await httpService.post('/auth/logout')
            localStorageService.removeToken()

            return res.data
        }
        return undefined
    }

    async getInformationUser(): Promise<any> {
        const res = await httpService.get('/auth/profile')
        return res.data.data
    }

    async forgotPassword({
        email,
        type,
    }: IForgotPasswordRequest): Promise<any> {
        const data: { email: string; type: string } = { email, type }
        const res = await httpService.post('/auth/resend-email', data)
        return res
    }

    async verifyResetPassword({
        email,
        maXacThuc,
    }: IVerifySignupEmailRequest): Promise<any> {
        const data: { email?: string; maXacThuc: string } = { email, maXacThuc }
        const res = await httpService.post('/auth/verify-reset-password', data)
        return res
    }

    async resetPassword({
        email,
        maXacThuc,
        matKhau,
    }: ISetPasswordRequest): Promise<any> {
        const deviceID = await getFingerprint()

        const data: { email?: string; maXacThuc: string; matKhau: string } = {
            email,
            maXacThuc,
            matKhau,
        }
        const headers = {
            'Device-ID': deviceID,
        }
        const res = await httpService.post('/auth/reset-password', data, {
            headers,
        })
        return res
    }

    async updateInfoUser({ maNguoiDung, soDienThoai, avatar, hoTen }: { maNguoiDung: string; soDienThoai: string; avatar?: File | string; hoTen: string }): Promise<any> {
        const formData = new FormData()
        formData.append('soDienThoai', soDienThoai)
        formData.append('hoTen', hoTen)
        if (avatar) {
            formData.append('avatar', avatar)
        }
        const res = await httpService.put(`/users/${maNguoiDung}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return res.data
    }
}

export const authenticationService = new AuthenticationService()
