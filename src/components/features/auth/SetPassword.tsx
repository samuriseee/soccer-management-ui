/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import React, { use } from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/navigation'
import { useMutation } from '@tanstack/react-query'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { Form, Checkbox, Spin } from 'antd'

import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { localStorageService } from '@/core/services/LocalStorage.service'
import HintText from '@/components/ui/HintText/HintText'
import Button from '@/components/ui/Button/Button'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Logo from '../home/Logo'
import InputPassword from '@/components/ui/InputPassword/InputPassword'
import { ValidateService } from '@/core/services/Validate.service'
import Alert from '@/components/ui/Alert/Alert'
import { useAuth } from '@/contexts/auth/AuthContext'
import { signIn } from '@/contexts/auth/reducers'
import { showMessage } from '@/components/ui/Notification/Notification'

const SetPassword = () => {
    const email = useSearchParams().get('email')
    const maXacThuc = useSearchParams().get('maXacThuc')
    const t = useTranslations('auth.SetPassword')
    const [error, setError] = useState('')
    const router = useRouter()
    const { dispatch } = useAuth()

    const { mutate: verifySignupEmail, isPending } = useMutation({
        mutationFn: authenticationService.verifySignupEmail,
        onSuccess: (res: any) => {},
        onError: (error: any) => {
            // router.push(
            //     NAVIGATION_PATHS.VERIFY_EMAIL_FAILED +
            //         `?email=${email}&message=${error.response.data.errors.other}`
            // )
            setError(error.response.data.message)
        },
    })

    // async function handleSignIn() {
    //     try {
    //         const userInformation =
    //             await authenticationService.getInformationUser()
    //         await dispatch(
    //             signIn({ isAuthenticated: true, user: userInformation })
    //         )
    //         setTimeout(() => {
    //             router.push(`${NAVIGATION_PATHS.HOME}`)
    //         }, 300)
    //     } catch (error) {
    //         console.error('Error fetching user information:', error)
    //     }
    // }

    async function handleSignIn() {
        try {
            const userInformation =
                await authenticationService.getInformationUser()
            dispatch(signIn({ isAuthenticated: true, user: userInformation }))
            // const redirectPath =
            //     userInformation?.vaiTro === 'chuSan'
            //         ? NAVIGATION_PATHS.DASH_BOARD_CHU_SAN
            //         : NAVIGATION_PATHS.DASH_BOARD_NGUOI_THUE

            // router.push(redirectPath)
            showMessage('success', 'Đăng nhập thành công')
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error)
        }
    }

    const { mutate: setPasswordMutation, isPending: isPendingSetPassword } =
        useMutation({
            mutationFn: authenticationService.setPassword,
            onSuccess: async (res: any) => {
                localStorageService.setToken(res.data.access_token)
                // localStorageService.setRefreshToken(res.data.refresh)
                await handleSignIn()
            },
            onError: (error: any) => {
                setError(error.response.data.message)
            },
        })

    const onFinish = (values: any) => {
        if (email && maXacThuc) {
            
            setPasswordMutation({
                // email: email,
                maXacThuc: maXacThuc,
                matKhau: values.matKhau,
            })
        }
    }

    // useEffect(() => {
    //     if (email && maXacThuc)
    //         verifySignupEmail({ email: email, maXacThuc: maXacThuc })
    // }, [])

    return (
        <div className="flex justify-between items-center relative">
            <div className="flex-1">
                {isPending ? (
                    <div className="max-w-[600px] w-full mx-auto flex flex-col gap-9 p-4 rounded-2xl">
                        <Spin size="large" />
                        <p className="text-center text-2xl font-bold italic">
                            {t('verifyingEmailLoading')}
                        </p>
                    </div>
                ) : (
                    <div className="max-w-[600px] w-full mx-auto flex flex-col gap-6 p-4 rounded-2xl">
                        <p className="text-center text-xl md:text-2xl font-bold">
                            {t('setPasswordTitle')}{' '}
                            <span className="block text-[var(--text-color-brand)] break-all text-sm md:text-xl">
                                {email}
                            </span>
                        </p>
                        <Form className="mt-4" onFinish={onFinish}>
                            <div className="flex justify-center pb-6"></div>
                            <InputFormItem
                                required
                                placeholder={t('passwordPlaceholder')}
                                name="matKhau"
                                type="password"
                                onChange={() => setError('')}
                            />
                            <Form.Item
                                name="matKhauNhapLai"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <HintText
                                                size="small"
                                                type="error"
                                                text={t('pleaseEnterPassword')}
                                            />
                                        ),
                                    },
                                    ({ getFieldValue }: any) => ({
                                        validator(_: any, value: any) {
                                            if (!value) {
                                                return Promise.resolve()
                                            }
                                            if (
                                                !ValidateService.validateMaxLength(
                                                    value,
                                                    128
                                                )
                                            )
                                                return Promise.reject(
                                                    <HintText
                                                        type="error"
                                                        text={t(
                                                            'passwordExceedsLimit'
                                                        )}
                                                    />
                                                )
                                            if (
                                                !value ||
                                                getFieldValue('matKhau') ===
                                                    value
                                            ) {
                                                return Promise.resolve()
                                            }
                                            return Promise.reject(
                                                <HintText
                                                    size="small"
                                                    type="error"
                                                    text={t(
                                                        'passwordMismatchMessage'
                                                    )}
                                                />
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <InputPassword
                                    placeholder={t(
                                        'reenterPasswordPlaceholder'
                                    )}
                                    size="large"
                                    className="!h-[40px]"
                                />
                            </Form.Item>
                            {error && (
                                // Display error alert
                                <Alert
                                    showIcon={true}
                                    className="mb-4"
                                    type="error"
                                    message={error}
                                />
                            )}
                            <Form.Item>
                                <Button
                                    htmlType="submit"
                                    type="primary"
                                    shape="square"
                                    style={{ width: '100%' }}
                                    loading={isPendingSetPassword}
                                >
                                    {t('setPassword')}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SetPassword
