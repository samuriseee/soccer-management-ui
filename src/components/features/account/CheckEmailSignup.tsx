/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */ 

'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/navigation'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { useMutation } from '@tanstack/react-query'
import HintText from '@/components/ui/HintText/HintText'
import { Spin } from 'antd'

const CheckEmailSignup = () => {
    const email = useSearchParams().get('email')
    const type = useSearchParams().get('type')
    const t = useTranslations('auth.CheckEmailSignup')
    const router = useRouter()
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // const { mutate: resendEmailMutation, isPending } = useMutation({
    //     mutationFn: authenticationService.resendEmail,
    //     onSuccess: (res: any) => {
    //         setSuccess(res.data.message)
    //         setError('')
    //     },
    //     onError: (error: any) => {
    //         setSuccess('')
    //         setError(
    //             error.response.data.errors.other ||
    //                 error.response.data.errors.email
    //         )
    //     },
    // })

    // const resendEmailHandler = () => {
    //     if (email && type) resendEmailMutation({ email: email, type: type })
    //     else setError(t('failedToCheckEmail'))
    // }

    return (
        <div className="flex justify-between items-center relative">
            <div className="flex-1">
                {/* {isPending ? (
                    <div className="max-w-[600px] w-full mx-auto flex flex-col gap-6 bg-gray-100 p-4 rounded-2xl">
                        <Spin size="large" />
                    </div>
                ) : (
                )} */}
                <div className="max-w-[600px] w-full mx-auto flex flex-col gap-6 bg-gray-100 p-4 rounded-2xl">
                    <span className="font-bold text-2xl">
                        {t('checkYourEmail')}
                    </span>
                    <p>
                        {t('weSentEmail')}{' '}
                        <span className="font-bold">{email}</span>
                        {'.'}
                    </p>
                    <p>
                        {type === 'signup'
                            ? t('pleaseCheckVerifyEmail')
                            : t('pleaseCheckForgotPassword')}
                    </p>
                    <p>{t('checkSpamFolder')}</p>
                    <div className="flex gap-2 items-center justify-center">
                        {/* <p
                                className="font-bold text-[var(--text-color-hyperlink-auth)] cursor-pointer"
                                onClick={resendEmailHandler}
                            >
                                {type === 'signup'
                                    ? t('resendVerifyEmail')
                                    : t('resendForgotPasswordEmail')}
                            </p>
                            <p>{t('or')}</p> */}
                        <Link
                            href={'/'}
                            className="font-bold text-[var(--text-color-hyperlink-auth)]"
                        >
                            {/* {t('enterDifferentEmail')} */}
                            Quay lại trang chủ
                        </Link>
                    </div>
                    {error != '' && (
                        <HintText size="large" type="error" text={error} />
                    )}
                    {success != '' && (
                        <HintText size="large" type="success" text={success} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CheckEmailSignup
