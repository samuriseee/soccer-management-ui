/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

"use client"
import React from 'react'
import Link from 'next/link'
import styles from './Footer.module.scss'
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { useLocale } from 'next-intl'

const Footer = () => {
    const locale = useLocale()
    const localePrefix = locale ? `/${locale}` : ''

    const quickLinks = [
        { label: 'Trang chủ', href: localePrefix || '/' },
        { label: 'Tìm sân bóng', href: localePrefix ? `${localePrefix}${NAVIGATION_PATHS.FIELD_LIST}` : NAVIGATION_PATHS.FIELD_LIST },
        { label: 'Tìm đối thủ', href: '#' },
        { label: 'Giới thiệu', href: '#' },
        { label: 'Liên hệ', href: '#' },
    ]

    const ownerLinks = [
        { label: 'Đăng ký sân bóng', href: localePrefix ? `${localePrefix}${NAVIGATION_PATHS.SIGN_IN}` : NAVIGATION_PATHS.SIGN_IN },
        { label: 'Quản lý sân bóng', href: '#' },
        { label: 'Báo cáo doanh thu', href: '#' },
        { label: 'Hỗ trợ kỹ thuật', href: '#' },
        { label: 'Chính sách đối tác', href: '#' },
    ]

    return (
        <footer className={`${styles.footer} bg-surface border-t border-gray-200`}> 
            <div className={`${styles.container} px-6 md:px-16 py-10`}> 
                <div className={`${styles.footer_grid} grid gap-8 md:grid-cols-4`}> 
                    <div className={styles.footer_about}>
                        <h3 className="text-xl font-semibold mb-2">SportSync</h3>
                        <p className="text-sm text-gray-600">
                            Nền tảng quản lý và đặt sân bóng trực tuyến hàng đầu
                            Việt Nam, kết nối người chơi và chủ sân bóng.
                        </p>
                        <div className={`${styles.social_links} flex gap-3 mt-4`}>
                            <a href="#" className={styles.social_link}>
                                <Facebook size={20} />
                            </a>
                            <a href="#" className={styles.social_link}>
                                <Instagram size={20} />
                            </a>
                            <a href="#" className={styles.social_link}>
                                <Twitter size={20} />
                            </a>
                            <a href="#" className={styles.social_link}>
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.footer_links}>
                        <h3 className="font-medium mb-2">Liên kết nhanh</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footer_links}>
                        <h3 className="font-medium mb-2">Dành cho chủ sân</h3>
                        <ul className="text-sm text-gray-700 space-y-2">
                            {ownerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footer_contact}>
                        <h3 className="font-medium mb-2">Liên hệ</h3>
                        <ul className="text-sm text-gray-700 space-y-3">
                            <li className="flex items-start gap-2">
                                <MapPin className={styles.contact_icon} />
                                <span>
                                    48 Cao Thắng - Hải Châu - Đà Nẵng
                                </span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className={styles.contact_icon} />
                                <span>0836935297</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className={styles.contact_icon} />
                                <span>contact@sportsync.vn</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={`${styles.copyright} text-center mt-8 text-sm text-gray-500`}>
                    <p>
                        © {new Date().getFullYear()} SportSync. Tất cả các
                        quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
