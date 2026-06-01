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
    Calendar,
    BarChart3,
    PanelLeft,
    User,
    LogOut,
    Settings,
    PencilIcon as Pitch,
} from 'lucide-react'
import styles from './SideBar.module.scss'

interface SidebarProps {
    setActiveContent: (content: string) => void
    activeContent: string
}

const Sidebar: React.FC<SidebarProps> = ({
    setActiveContent,
    activeContent,
}) => {
    const [collapsed, setCollapsed] = useState(false)

    // Mock user data - replace with actual data
    const user = {
        name: 'Nguyễn Văn A',
        role: 'Chủ sân',
        avatar: '/placeholder.svg?height=40&width=40',
    }

    const menuItems = [
        {
            id: 'booking',
            label: 'Quản lý đặt sân',
            icon: <Calendar size={20} />,
        },
        {
            id: 'field',
            label: 'Quản lý sân',
            icon: <Pitch size={20} />,
        },
        {
            id: 'report',
            label: 'Báo cáo',
            icon: <BarChart3 size={20} />,
        },
    ]

    const bottomMenuItems = [
        {
            id: 'profile',
            label: 'Thông tin cá nhân',
            icon: <User size={20} />,
        },
        {
            id: 'settings',
            label: 'Cài đặt',
            icon: <Settings size={20} />,
        },
        {
            id: 'logout',
            label: 'Đăng xuất',
            icon: <LogOut size={20} />,
        },
    ]

    const handleMenuClick = (id: string) => {
        setActiveContent(id)
    }

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
                        src={user.avatar || '/placeholder.svg'}
                        alt={user.name}
                        width={40}
                        height={40}
                        className={styles.avatar}
                    />
                </div>
                {!collapsed && (
                    <div className={styles.user_details}>
                        <p className={styles.user_name}>{user.name}</p>
                        <p className={styles.user_role}>{user.role}</p>
                    </div>
                )}
            </div>

            <div className={styles.menu_container}>
                <ul className={styles.menu_list}>
                    {menuItems.map((item) => (
                        <li
                            key={item.id}
                            className={`${styles.menu_item} ${activeContent === item.id ? styles.active : ''}`}
                            onClick={() => handleMenuClick(item.id)}
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
                            key={item.id}
                            className={styles.menu_item}
                            onClick={() => handleMenuClick(item.id)}
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
