/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React from 'react'
import Button from '../Button/Button'
import styles from './NotFound404.module.scss'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const NotFound404 = () => {
    const t = useTranslations('not_found.notFound404')
    const router = useRouter()
    const handleReturnHomePage = () => {
        router.push(NAVIGATION_PATHS.HOME)
    }
    return (
        <>
            <div className={styles.container}>
                <div className={styles.content_wrapper}>
                    <div className={styles.image_wrapper}>
                        <Image
                            width={400}
                            height={240}
                            src="/images/404_notfound.webp"
                            alt=""
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.text_wrapper}>
                        <p
                            data-testid="not-found-404-main-text"
                            className={styles.text_main}
                        >
                            Xin lỗi, trang này hiện không khả dụng.
                            {/* Ôi không! Trang không tồn tại */}
                        </p>
                        <p
                            data-testid="not-found-404-sub-text"
                            className={styles.text_sub}
                        >
                            Trang này không tồn tại hoặc đã bị xóa. <br />
                            Bạn nên quay lại trang chủ.
                        </p>
                    </div>
                    <div className={styles.button_wrapper}>
                        <Button
                            onClick={handleReturnHomePage}
                            shape="square"
                            type="primary"
                            className={styles.return_btn}
                        >
                            {t('returnHomeBtn')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NotFound404
