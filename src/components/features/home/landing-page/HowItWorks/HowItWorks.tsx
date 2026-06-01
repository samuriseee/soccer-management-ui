/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './HowItWorks.module.scss'
import BenefitsSection from '../BenefitsSection/BenefitsSection'

const steps = [
    {
        title: 'Đăng ký tài khoản',
        description: 'Tạo tài khoản miễn phí với thông tin cơ bản của bạn',
    },
    {
        title: 'Tìm kiếm sân bóng',
        description: 'Tìm sân bóng phù hợp theo vị trí, giá cả và tiện ích',
    },
    {
        title: 'Đặt sân trực tuyến',
        description: 'Chọn ngày giờ và thanh toán trực tuyến an toàn',
    },
    {
        title: 'Tận hưởng trận đấu',
        description: 'Đến sân và tận hưởng trận đấu của bạn',
    },
]

const HowItWorks = () => {
    return (
        <section className={styles.how_it_works}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Cách thức hoạt động</h2>
                    <p>
                        Quy trình đơn giản để bắt đầu sử dụng nền tảng của chúng
                        tôi
                    </p>
                </div>

                <div className={styles.steps_grid}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                            <div className={styles.step_number}>
                                <span>{index + 1}</span>
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* <BenefitsSection /> */}
            </div>
        </section>
    )
}

export default HowItWorks
