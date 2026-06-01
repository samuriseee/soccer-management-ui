/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

"use client";
import React from 'react'
import styles from './RegisterOptions.module.scss'
import RegisterChoice from './RegisterChoice/RegisterChoice'
import BenefitsSection from '../BenefitsSection/BenefitsSection';
import SearchFootballField from '@/components/features/fields/components/SearchFootballField/SearchFootballField';
import { NAVIGATION_PATHS } from '@/constants/constants'
import { useRouter } from '@/navigation';

const RegisterOptions = () => {
    const router = useRouter()

    type Choice = {
        title: string
        description: string
        type: 'owner' | 'renter'
        onClick: () => void
        textButton: string
    }

    const choices: Choice[] = [
        {
            title: 'Trở thành chủ sân',
            description: 'Quản lý sân bóng, lịch đặt sân và doanh thu dễ dàng.',
            type: 'owner',
            onClick: () => console.log('Chủ sân đăng ký'),
            textButton: 'Đăng ký ngay',
        },
        {
            title: 'Trở thành người thuê sân',
            description: 'Tìm kiếm, đặt sân nhanh chóng và tiện lợi.',
            type: 'renter',
            onClick: () => console.log('Người thuê sân đăng ký'),
            textButton: 'Đăng ký ngay',
        },
    ]

    const handleSearch = (params: {
        search?: string
        selectedDistrict?: string | null
        selectedWard?: string | null
        kinhDo?: number
        viDo?: number
        trigger?: string
    }) => {
        const query = new URLSearchParams()
        if (params.search) query.set('search', params.search)
        if (params.selectedDistrict) query.set('quanHuyen', params.selectedDistrict)
        if (params.selectedWard) query.set('phuongXa', params.selectedWard)
        if (params.kinhDo) query.set('kinhDo', String(params.kinhDo))
        if (params.viDo) query.set('viDo', String(params.viDo))
        router.push(`${NAVIGATION_PATHS.FIELD_LIST}?${query.toString()}`)
    }

    return (
        <section className={styles.register_option_wrap}>
            <div className={styles.register_option_container}>
                <SearchFootballField onSearch={handleSearch} />
                <div className={styles.intro_text}>
                    <h2 className={styles.intro_title}>
                        Hỗ trợ tìm kiếm sân bãi nhanh chóng
                    </h2>
                    <p className={styles.intro_description}>
                        Quản lý hoạt động của sân
                        <br />
                        Xem lịch trống - Đặt lịch online
                    </p>
                </div>
                {/* <div className={styles.register_choices}>
                    {choices.map((choice, index) => (
                        <RegisterChoice key={index} {...choice} />
                    ))}
                </div> */}

                <BenefitsSection />
            </div>
        </section>
    )
}

export default RegisterOptions
