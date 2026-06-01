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
import styles from './ForgotPasswordForm.module.scss'
import { Form } from 'antd'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Button from '@/components/ui/Button/Button'
import { useRouter } from '@/navigation'
import { useMutation } from '@tanstack/react-query'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { NAVIGATION_PATHS } from '@/constants/constants'

const ForgotPasswordForm = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const { mutate: forgotPasswordMutation, isPending } = useMutation({
        mutationFn: authenticationService.forgotPassword,
        onSuccess: (res: any, { email }) => {
            setError('')
            // router.push(
            //     `${NAVIGATION_PATHS.CHECK_EMAIL_SIGNUP}?email=${email.replace('+', '%2B')}&type=reset`
            // )
        },
        onError: (error: any) => {
            setError(
                error.response.data.errors.other ||
                    error.response.data.errors.email
            )
        },
    })

    const resendEmailHandler = (email: string) => {
        forgotPasswordMutation({ email: email, type: 'reset' })
    }

    const onFinish = (values: any) => {
        const { email } = values
        resendEmailHandler(email)
    }

    return (
        <div className={styles.forgot_outer_container}>
            <div className={styles.forgot_container}>
                <div className={styles.forgot_wrap}>
                    <p className={styles.title}>Quên mật khẩu</p>
                    <Form
                        onFinish={onFinish}
                        className={styles.forgot_wrap_form}
                    >
                        <InputFormItem
                            required
                            placeholder="Nhập email của bạn"
                            name="email"
                            type="email"
                            onChange={() => setError('')}
                            className={styles.input}
                        />
                        {/* {error && (
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
                            )} */}
                        <Form.Item>
                            <Button
                                htmlType="submit"
                                type="primary"
                                shape="square"
                                style={{ width: '100%' }}
                                loading={isPending}
                            >
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className={styles.login_option}>
                    <p onClick={() => router.push(NAVIGATION_PATHS.SIGN_IN)}>
                        Quay lại đăng nhập
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordForm
