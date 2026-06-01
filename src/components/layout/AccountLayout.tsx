/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { PropsWithChildren } from 'react'
import styles from './AccountLayout.module.scss'
import Logo from '../features/home/Logo'
import Image from 'next/image'
import { useRouter } from '@/navigation'

const AccountLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const router = useRouter()

    return (
        <section className={styles.account_section}>
            <div className={styles.content_area}>
                <div className={styles.header_wrap}>
                    <Logo onClick={() => router.push('/')} />
                </div>
                <div className={styles.content_wrap}>{children}</div>
            </div>
            <div className={styles.right_banner}>
                <Image
                    src="/images/register_slide.webp"
                    alt=""
                    width={500}
                    height={100}
                    className={styles.banner_img}
                />
            </div>
        </section>
    )
}

export default AccountLayout
