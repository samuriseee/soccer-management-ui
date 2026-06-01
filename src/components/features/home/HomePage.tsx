/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import RegisterOptions from './landing-page/RegisterOptions/RegisterOptions'
import FeaturesSection from './landing-page/FeaturesSection/FeaturesSection'
import FootballFieldSection from './landing-page/FootballFieldSection/FootballFieldSection'
import HowItWorks from './landing-page/HowItWorks/HowItWorks'
import FAQSection from './landing-page/FAQSection/FAQSection'
import { useAuth } from '@/contexts/auth/AuthContext'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'

const HomePage = () => {

    const { isAuthenticated, user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated && user?.vaiTro) {
            if (user.vaiTro === 'admin') {
                router.push(NAVIGATION_PATHS.DASH_BOARD_ADMIN)
            }
            else if (user.vaiTro === 'chuSan') {
                router.push(NAVIGATION_PATHS.DASH_BOARD_CHU_SAN)
            }
        }
    }, [isAuthenticated, user, router])

    return (
        <div>
            <RegisterOptions />
            <HowItWorks />
            <FeaturesSection />
            <FootballFieldSection />
            <FAQSection />
        </div>
    )
}

export default HomePage
