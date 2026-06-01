/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import styles from './SignInModal.module.scss'
import Button from '@/components/ui/Button/Button'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import { useAuth } from '@/contexts/auth/AuthContext'
import { signIn } from '@/contexts/auth/reducers'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { localStorageService } from '@/core/services/LocalStorage.service'
import { Link, useRouter } from '@/navigation'
import { useMutation } from '@tanstack/react-query'
import { Form, Modal } from 'antd'
import React, { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GoogleLoginButton from '@/hooks/useGoogleLogin'
import Alert from '@/components/ui/Alert/Alert'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { showMessage } from '@/components/ui/Notification/Notification'

interface LoginModalProps {
    visible: boolean
    onOk: () => void
    onCancel: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ visible, onOk, onCancel }) => {
    const { dispatch, user } = useAuth()
    const clientId = `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`
    const [error, setError] = useState('')
    const router = useRouter()

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
            onCancel()
        } catch (error) {
            console.error('Lỗi khi lấy thông tin user:', error)
        }
    }

    const signInGoogleFn = async ({
        accessToken,
        user,
    }: {
        accessToken: string
        user: any
    }) => {
        const res = await authenticationService.signUpGoogle({
            accessToken,
            user,
        })
        if (!res?.data?.access_token)
            throw new Error('Không có access_token trong phản hồi từ API')
        localStorageService.setToken(res.data.access_token)
        // await handleSignIn()
        return res
    }

    const { mutate: signInGoogleMutation, isPending: isPendingSignInGoogle } =
        useMutation({
            mutationFn: signInGoogleFn,
            onSuccess: async (data) => {
                await handleSignIn()
            },
            onError: (error: any) => {
                setError(
                    error.response?.data?.message || 'Đăng nhập Google thất bại'
                )
            },
        })

    const handleGoogleLogin = (response: any) => {
        setError('')
        if (response?.accessToken && response?.user) {
            signInGoogleMutation({
                accessToken: response.accessToken,
                user: response.user,
            })
        } else {
            setError('Đăng nhập Google thất bại')
        }
    }

    const { mutate: signInMutation, isPending: isPendingSignIn } = useMutation({
        mutationFn: authenticationService.signIn,
        onSuccess: async (res: any) => {
            localStorageService.setToken(res.data.access_token)
            // localStorageService.setRefreshToken(res.data.refresh)
            await handleSignIn()
        },
        onError: (error: any) => {
            setError(error.response.data.message || 'Đăng nhập thất bại')
        },
    })

    const onFinish = (values: any) => {
        const { email, matKhau } = values
        signInMutation({ email, matKhau })
    }

    return (
        <Modal
            footer={null}
            destroyOnClose={true}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            closeIcon={false}
            className={styles.modal}
        >
            <div className={styles.login_modal}>
                <div className={styles.title_container}>
                    <p className={styles.title_text}>Đăng nhập</p>
                    <IconX
                        className={styles.icon_close}
                        size={24}
                        onClick={onCancel}
                    />
                </div>
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
                <Form onFinish={onFinish} className={styles.form_container}>
                    <InputFormItem
                        required
                        disabled={isPendingSignIn}
                        placeholder={'Nhập emmail'}
                        name="email"
                        type="email"
                    />
                    <InputFormItem
                        name="matKhau"
                        placeholder={'Nhập mật khẩu'}
                        type="password"
                        required
                        disabled={isPendingSignIn}
                    />
                    <div className={styles.forgot_password}>
                        <Link
                            className={styles.forgot_link}
                            href={NAVIGATION_PATHS.FORGOT_PASSWORD}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    {error && (
                        <div>
                            <Alert
                                type="error"
                                showIcon={true}
                                message={error}
                            />
                        </div>
                    )}
                    <Form.Item>
                        <Button
                            htmlType="submit"
                            type="primary"
                            shape="square"
                            style={{ width: '100%' }}
                            disabled={isPendingSignIn}
                            loading={isPendingSignIn}
                        >
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
                <div className={styles.register_option}>
                    <p>Chưa có tài khoản?</p>
                    <div className={styles.register_links}>
                        <Link
                            href={NAVIGATION_PATHS.SIGN_UP_CHU_SAN}
                            className={styles.register_link}
                        >
                            Đăng ký Chủ sân
                        </Link>
                        <span className={styles.separator}>/</span>
                        <Link
                            href={NAVIGATION_PATHS.SING_UP_NGUOI_THUE}
                            className={styles.register_link}
                        >
                            Đăng ký Người thuê
                        </Link>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default LoginModal
