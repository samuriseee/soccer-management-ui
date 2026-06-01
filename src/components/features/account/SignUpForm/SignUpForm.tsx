/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { useState } from 'react'
import styles from './SignUpForm.module.scss'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleLoginButton from '@/hooks/useGoogleLogin'
import Button from '@/components/ui/Button/Button'
import { Form } from 'antd'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Checkbox from '@/components/ui/CheckBox/CheckBox'
import { Link, useRouter } from '@/navigation'
import { useMutation } from '@tanstack/react-query'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { NAVIGATION_PATHS } from '@/constants/constants'
import Alert from '@/components/ui/Alert/Alert'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { showMessage } from '@/components/ui/Notification/Notification'
import HintText from '@/components/ui/HintText/HintText'
import { ValidateService } from '@/core/services/Validate.service'
import InputPassword from '@/components/ui/InputPassword/InputPassword'
import { localStorageService } from '@/core/services/LocalStorage.service'
import { useAuth } from '@/contexts/auth/AuthContext'
import { signIn } from '@/contexts/auth/reducers'

interface SignUpFormProps {
    vaiTro: 'nguoiThue' | 'chuSan'
}

const SignUpForm = ({ vaiTro }: SignUpFormProps) => {
    const clientId = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`
    const [error, setError] = useState('')
    const router = useRouter()
    const { dispatch } = useAuth()

    const [form] = Form.useForm()

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

    const signUpGoogleFn = async ({
        accessToken,
        user,
    }: {
        accessToken: string
        user: any
    }) => {
        const res = await authenticationService.signUpGoogle({
            accessToken,
            user,
            vaiTro,
        })
        if (!res?.data?.access_token)
            throw new Error('Không có access_token trong phản hồi từ API')
        localStorageService.setToken(res.data.access_token)
        // await handleSignIn()
        return res
    }

    const { mutate: signUpGoogleMutation, isPending: isPendingSignUpGoogle } =
        useMutation({
            mutationFn: signUpGoogleFn,
            onSuccess: async (data) => {
                await handleSignIn()
                // showMessage('success', 'Đăng kí bằng Google thành công')
                // router.push(NAVIGATION_PATHS.HOME)
            },
            onError: (error: any) => {
                setError(
                    error.response?.data?.message || 'Đăng kí Google thất bại'
                )
            },
        })

    const handleGoogleLogin = (response: any) => {
        setError('')
        if (response?.accessToken && response?.user) {
            signUpGoogleMutation({
                accessToken: response.accessToken,
                user: response.user,
            })
        } else {
            setError('Đăng nhập Google thất bại')
        }
    }

    const { mutate: signUpEmailMutation, isPending: isPendingSignUpEmail } =
        useMutation({
            mutationFn: authenticationService.signupEmail,
            onSuccess: async (data: any, variables: any) => {
                const email = variables.email
                router.push(
                    `${NAVIGATION_PATHS.CHECK_EMAIL_SIGNUP}?email=${encodeURIComponent(
                        email
                    ).replace(/\+/g, '%2B')}`
                )
            },
            onError: (error: any) => {
                setError(error.response.data.message)
            },
        })

    const onFinish = (values: any) => {
        const { email, hoTen, soDienThoai } = values

        const signUpData = {
            hoTen,
            email,
            soDienThoai,
            vaiTro,
        }

        signUpEmailMutation(signUpData)
    }

    return (
        <div className={styles.sign_up_outer_container}>
            <div className={styles.sign_up_container}>
                <div className={styles.sign_up_wrap}>
                    <div className={styles.sign_up_wrap_top}>
                        <p className={styles.title}>
                            {vaiTro === 'nguoiThue'
                                ? 'Đăng kí tài khoản cho người thuê'
                                : 'Đăng tí tài khoản cho chủ sân'}
                        </p>
                        <div className={styles.google_login_container}>
                            <GoogleOAuthProvider clientId={clientId}>
                                <GoogleLoginButton
                                    text={'Đăng nhập với google'}
                                    callback={handleGoogleLogin}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <div className={styles.divider}>
                            <hr />
                            <span>hoặc</span>
                            <hr />
                        </div>
                    </div>
                    <Form
                        onFinish={onFinish}
                        form={form}
                        className={styles.sign_up_wrap_form}
                    >
                        <InputFormItem
                            required
                            placeholder="Họ và tên"
                            name="hoTen"
                            type="full_name"
                            onChange={() => setError('')}
                            disabled={isPendingSignUpEmail}
                            className={styles.input}
                        />
                        <InputFormItem
                            required
                            placeholder={'Số điện thoại'}
                            name="soDienThoai"
                            type="phone"
                            onChange={() => setError('')}
                            disabled={isPendingSignUpEmail}
                            className={styles.input}
                        />
                        <InputFormItem
                            required
                            placeholder="Email"
                            name="email"
                            type="email"
                            onChange={() => setError('')}
                            disabled={isPendingSignUpEmail}
                            className={styles.input}
                        />
                        <Form.Item name="isRemember" valuePropName="checked">
                            <Checkbox className="">
                                I agree to the <strong>Terms of Service</strong>{' '}
                                and <strong>Privacy Policy</strong>
                            </Checkbox>
                        </Form.Item>
                        {error && (
                            <Alert
                                showIcon={true}
                                className="mb-4"
                                icon={
                                    <IoCloseCircleSharp
                                        size={20}
                                        color="var(--text-color-red)"
                                    />
                                }
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
                                disabled={isPendingSignUpEmail}
                                loading={isPendingSignUpEmail}
                            >
                                Đăng ký
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.login_option}>
                    <p>
                        Bạn đã có tài khoản?{' '}
                        <Link
                            href={NAVIGATION_PATHS.SIGN_IN}
                            className={styles.login_link}
                        >
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpForm
