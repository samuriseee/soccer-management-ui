/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Roboto, Roboto_Mono } from 'next/font/google'
import QueryClientProviderWrapper from '@/contexts/QueryClientProvider'
import AuthProvider from '@/contexts/auth/AuthContext'
import { Suspense } from 'react'
import Loading from './loading'
import '../globals.css'
import robotoFont from '@/core/config/fontConfig'
import { ConfigProvider } from 'antd'

export const metadata = {
    title: 'NH11 - Đặt sân 24/7',
    description: 'Nền tảng đặt sân bóng đá trực tuyến, dễ dàng và nhanh chóng',
}

// Define fonts
const roboto = Roboto({
    subsets: ['latin'],
    weight: ['400', '700'], // Include weights you need
    variable: '--font-roboto', // Optional CSS variable name
    display: 'swap',
})

const robotoMono = Roboto_Mono({
    subsets: ['latin'],
    weight: ['400', '500'], // Include weights you need
    variable: '--font-roboto-mono', // Optional CSS variable name
})

type Params = Promise<{ locale: string }>

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Params
}) {
    const { locale } = await params

    // Ensure the incoming `locale` is valid
    if (!routing.locales.includes(locale as 'en' | 'vi')) {
        notFound()
    }

    // Fetch messages for the current locale
    const messages = await getMessages()

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={robotoFont.className}>
                <Suspense fallback={<Loading />}>
                    <QueryClientProviderWrapper>
                        <NextIntlClientProvider messages={messages}>
                            <AuthProvider>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                fontFamily:
                                                    robotoFont.style
                                                        .fontFamily,
                                                colorPrimary:
                                                    'var(--text-color-brand)',
                                                colorText:
                                                    'var(--text-color-primary)',
                                                colorTextSecondary:
                                                    'var(--text-color-secondary)',
                                                colorBgContainer:
                                                    'var(--background-white-default)',
                                                colorBorder:
                                                    'var(--border-color-default)',
                                                borderRadius: 8,
                                            },
                                            components: {
                                                Button: {
                                                    colorPrimary:
                                                        'var(--text-color-brand)',
                                                    controlHeight: 40,
                                                    controlHeightLG: 48,
                                                    controlHeightSM: 32,
                                                },
                                                Input: {
                                                    colorBorder:
                                                        'var(--border-color-default)',
                                                    colorText:
                                                        'var(--text-color-primary)',
                                                    paddingBlock: 10,
                                                    paddingInline: 12,
                                                    borderRadius: 8,
                                                },
                                                Select: {
                                                    colorText:
                                                        'var(--text-color-primary)',
                                                },
                                                Tabs: {
                                                    inkBarColor:
                                                        'var(--background-blue-default)',
                                                },
                                                Pagination: {
                                                    itemSize: 40,
                                                },
                                            },
                                        }}
                                    >
                                        {children}
                                    </ConfigProvider>
                            </AuthProvider>
                        </NextIntlClientProvider>
                    </QueryClientProviderWrapper>
                </Suspense>
            </body>
        </html>
    )
}
