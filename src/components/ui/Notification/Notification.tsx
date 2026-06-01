/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Image, message } from 'antd'
import styles from './Notification.module.scss'

const iconMap = {
    success: '/icon/circle-success-icon.svg',
    info: '/icon/circle-info-icon.svg',
    warning: '/icon/circle-warning-icon.svg',
    error: '/icon/circle-error-icon.svg',
}

export const showMessage = (
    type: 'success' | 'error' | 'info' | 'warning',
    content: any,
    duration = 3
) => {
    const messageContent = Array.isArray(content) ? (
        <ul
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
            }}
        >
            {content.map((msg, index) => (
                <li key={index}>{msg}</li>
            ))}
        </ul>
    ) : (
        content
    )

    message.open({
        type,
        duration: duration,
        className: styles.notification,
        icon: (
            <div className={styles.icon}>
                <Image
                    width={14}
                    alt={type}
                    src={iconMap[type]}
                    preview={false}
                />
            </div>
        ),
        content: <div className={styles.content}>{messageContent}</div>,
    })
}
