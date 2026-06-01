/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import type React from 'react'
import { useState } from 'react'
import Image from 'next/image'
import { PanelLeft } from 'lucide-react'
import styles from './SideBar.module.scss'
import AvatarUser from '@/components/ui/AvatarUser/AvatarUser'

export interface MenuItem {
    id: string
    key?: string
    label: string
    icon: React.ReactNode
    onClick?: () => void
}

interface SidebarProps {
    user: {
        hoTen: string
        avatar: string
        vaiTro: 'chuSan' | 'nguoiThue' | 'admin'
    }
    menuItems: MenuItem[]
    bottomMenuItems: MenuItem[]
    activeItem: string
    onMenuItemClick: (itemId: string) => void

    // Logo (tùy chọn)
    logo?: {
        src: string
        alt: string
        text: string
    }
}

const Sidebar: React.FC<SidebarProps> = ({
    user,
    menuItems,
    bottomMenuItems,
    activeItem,
    onMenuItemClick,
    logo = {
        src: '/images/logo-circel.png',
        alt: 'Logo',
        text: 'FootballField',
    },
}) => {
    const [collapsed, setCollapsed] = useState(false)

    const toggleSidebar = () => {
        setCollapsed(!collapsed)
    }

    // Hàm lấy ID của item (tương thích với cả key và id)
    const getItemId = (item: MenuItem): string => {
        return item.id || item.key || ''
    }

    // Hàm kiểm tra item có active không
    const isItemActive = (item: MenuItem): boolean => {
        const itemId = getItemId(item)
        return itemId.toLowerCase() === activeItem.toLowerCase()
    }

    // Hàm xử lý khi click vào menu item
    const handleMenuClick = (item: MenuItem) => {
        if (item.onClick) {
            item.onClick()
            return
        }

        onMenuItemClick(getItemId(item))
    }

    // Hiển thị vai trò người dùng
    const getRoleText = (vaiTro: string): string => {
        if (vaiTro === 'chuSan') return 'Chủ sân'
        if (vaiTro === 'nguoiThue') return 'Người thuê sân'
        if (vaiTro === 'admin') return 'Quản trị viên'
        return 'Không xác định'
    }

    return (
        <div
            className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
        >
            <div className={styles.sidebar_header}>
                <div className={styles.logo_container}>
                    <Image
                        src={logo.src}
                        alt={logo.alt}
                        width={32}
                        height={32}
                        className={styles.logo_image}
                    />
                    {!collapsed && (
                        <h1 className={styles.logo_text}>{logo.text}</h1>
                    )}
                </div>
                <button className={styles.collapse_btn} onClick={toggleSidebar}>
                    <PanelLeft
                        size={20}
                        className={collapsed ? styles.rotate_180 : ''}
                    />
                </button>
            </div>

            <div className={styles.user_info}>
                <div className={styles.avatar_container}>
                    <AvatarUser
                        size={36}
                        userInfo={user}
                        classNameAvatar={styles.avatar}
                    />
                </div>
                {!collapsed && (
                    <div className={styles.user_details}>
                        <p className={styles.user_name}>{user?.hoTen}</p>
                        <p className={styles.user_role}>
                            {getRoleText(user?.vaiTro)}
                        </p>
                    </div>
                )}
            </div>

            <div className={styles.menu_container}>
                <ul className={styles.menu_list}>
                    {menuItems.map((item) => (
                        <li
                            key={getItemId(item)}
                            className={`${styles.menu_item} ${isItemActive(item) ? styles.active : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <div className={styles.menu_icon}>{item.icon}</div>
                            {!collapsed && (
                                <span className={styles.menu_label}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.bottom_menu}>
                <ul className={styles.menu_list}>
                    {bottomMenuItems.map((item) => (
                        <li
                            key={getItemId(item)}
                            className={`${styles.menu_item} ${isItemActive(item) ? styles.active : ''}`}
                            onClick={() => handleMenuClick(item)}
                        >
                            <div className={styles.menu_icon}>{item.icon}</div>
                            {!collapsed && (
                                <span className={styles.menu_label}>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
