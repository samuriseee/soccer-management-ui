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
import {
    User,
    Lock,
    Settings,
    LogOut,
    PanelLeft,
    Search,
    Calendar,
    Users,
    Heart,
} from 'lucide-react'
import styles from './SideBar.module.scss'

interface SideBarProps {
    onMenuClick: (key: string) => void
    selectedContent: string
}

const SideBar: React.FC<SideBarProps> = ({ onMenuClick, selectedContent }) => {
    const [collapsed, setCollapsed] = useState(false)

    // Mock user data - replace with actual data from your authentication system
    const mockUser = {
        maNguoiDung: 'ND001',
        hoTen: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        soDienThoai: '0901234567',
        vaiTro: 'nguoiThue',
        soDuTaiKhoan: 500000,
        avatar: '/placeholder.svg?height=40&width=40',
    }

    const menuItems = [
        {
            label: 'Thông tin cá nhân',
            key: 'PROFILE',
            icon: <User size={20} />,
        },
        {
            label: 'Đổi mật khẩu',
            key: 'CHANGE_PASSWORD',
            icon: <Lock size={20} />,
        },
        {
            label: 'Danh sách sân bóng',
            key: 'FIELD_LIST',
            icon: <Search size={20} />,
        },
        {
            label: 'Lịch sử đặt sân',
            key: 'BOOKING_HISTORY',
            icon: <Calendar size={20} />,
        },
        {
            label: 'Giao lưu - Tìm đối',
            key: 'FIND_OPPONENTS',
            icon: <Users size={20} />,
        },
        {
            label: 'Sân yêu thích',
            key: 'FAVORITE_FIELDS',
            icon: <Heart size={20} />,
        },
    ]

    const bottomMenuItems = [
        {
            label: 'Cài đặt',
            key: 'SETTINGS',
            icon: <Settings size={20} />,
        },
        {
            label: 'Đăng xuất',
            key: 'LOGOUT',
            icon: <LogOut size={20} />,
        },
    ]

    const toggleSidebar = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div
            className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}
        >
            <div className={styles.sidebar_header}>
                <div className={styles.logo_container}>
                    <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="Logo"
                        width={32}
                        height={32}
                        className={styles.logo_image}
                    />
                    {!collapsed && (
                        <h1 className={styles.logo_text}>FootballField</h1>
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
                    <Image
                        src={mockUser.avatar || '/placeholder.svg'}
                        alt={mockUser.hoTen}
                        width={40}
                        height={40}
                        className={styles.avatar}
                    />
                </div>
                {!collapsed && (
                    <div className={styles.user_details}>
                        <p className={styles.user_name}>{mockUser.hoTen}</p>
                        <p className={styles.user_role}>
                            {mockUser.vaiTro === 'nguoiThue'
                                ? 'Người thuê sân'
                                : 'Chủ sân'}
                        </p>
                    </div>
                )}
            </div>

            <div className={styles.menu_container}>
                <ul className={styles.menu_list}>
                    {menuItems.map((item) => (
                        <li
                            key={item.key}
                            className={`${styles.menu_item} ${selectedContent === item.key ? styles.active : ''}`}
                            onClick={() => onMenuClick(item.key)}
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
                            key={item.key}
                            className={`${styles.menu_item} ${selectedContent === item.key ? styles.active : ''}`}
                            onClick={() => onMenuClick(item.key)}
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

export default SideBar
