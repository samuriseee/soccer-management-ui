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
import styles from './BenefitsSection.module.scss'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { useAuth } from '@/contexts/auth/AuthContext'

const benefits = [
    'Hệ thống đặt sân trực tuyến 24/7, không cần gọi điện',
    'Thanh toán an toàn',
    'Hệ thống đánh giá minh bạch từ người dùng thực',
    'Tìm đối thủ và đồng đội dễ dàng',
    'Quản lý lịch sử đặt sân và hoạt động',
    'Ưu đãi độc quyền cho thành viên thường xuyên',
]

const BenefitsSection = () => {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <div className={styles.benefits_section}>
            <div className={styles.benefits_content}>
                <div className={styles.benefits_list}>
                    <h3>Tại sao nên chọn chúng tôi?</h3>
                    <ul>
                        {benefits.map((benefit, index) => (
                            <li key={index}>
                                <CheckCircle className={styles.check_icon} />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {user ? ' ' : (
                    <div className={styles.signup_card}>
                        <h4>Bắt đầu ngay hôm nay</h4>
                        <p>
                            Đăng ký miễn phí và trải nghiệm nền tảng quản lý sân
                            bóng tốt nhất
                        </p>
                        <div className={styles.button_group}>
                            <Button
                                shape="square"
                                type="primary"
                                className={styles.register_owner_button}
                                onClick={() =>
                                    router.push(NAVIGATION_PATHS.SIGN_UP_CHU_SAN)
                                }
                            >
                                Đăng ký cho chủ sân
                            </Button>
                            <Button
                                shape="square"
                                type="default"
                                className={styles.register_renter_button}
                                onClick={() =>
                                    router.push(NAVIGATION_PATHS.SING_UP_NGUOI_THUE)
                                }
                            >
                                Đăng ký cho người thuê
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BenefitsSection
