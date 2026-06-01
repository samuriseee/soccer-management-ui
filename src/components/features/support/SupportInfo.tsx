/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './SupportInfo.module.scss'

const SupportInfo = () => (
    <div className={styles.support_info_container}>
        <h1 className={styles.title}>Hỗ trợ khách hàng</h1>
        <ul className={styles.contact_list}>
            <li>
                <span className={styles.label}>Email:</span>
                <a
                    className={styles.brand_link}
                    href="mailto:nguyenhuyc1821@gmail.com"
                >
                    nguyenhuyc1821@gmail.com
                </a>
            </li>
            <li>
                <span className={styles.label}>Hotline:</span>
                <a className={styles.brand_link} href="tel:0123456789">
                    0123 456 789
                </a>
            </li>
        </ul>
    </div>
)

export default SupportInfo
