/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { useState } from 'react'
import { Link, useRouter } from '@/navigation'
import { useTranslations } from 'next-intl'
import { Dropdown, Menu } from 'antd'
import Button from '@/components/ui/Button/Button'
import LoginModal from '@/components/features/account/SignInModal/SignInModal'
import Logo from '../../features/home/Logo'
import { useAuth } from '@/contexts/auth/AuthContext'
import SwitchLanguage from '../../features/home/SwitchLanguage'
import { getInitials } from '@/helper/utils'
import ModalConfirm from '../../features/home/ModalConfirm'
import { signOut } from '@/contexts/auth/reducers'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { IconChevronDown, IconMenu2, IconX } from '@tabler/icons-react'
import styles from './Header.module.scss'
import { showMessage } from '@/components/ui/Notification/Notification'
import AvatarUser from '@/components/ui/AvatarUser/AvatarUser'
import useIsMobile from '@/hooks/useIsMobile'
import { usePathname } from 'next/navigation'

const Header = () => {
    const { user, dispatch, isAuthenticated } = useAuth()
    const t = useTranslations('header')
    const router = useRouter()
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false)
    const [isConfirmLogout, setIsConfirmLogout] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const isMobile = useIsMobile(768)
    const pathname = usePathname()
    
    const showModal = () => setIsLoginModalVisible(true)
    const handleOk = () => setIsLoginModalVisible(false)
    const handleCancel = () => setIsLoginModalVisible(false)

    const handleLogout = async () => {
        try {
            await authenticationService.logoutUser()
            dispatch(signOut())
            setIsConfirmLogout(false)
            setMobileMenuOpen(false)
            showMessage('success', t('logoutSuccess'))
            showModal()
        } catch (error) {
            showMessage('error', t('logoutError'))
        }
    }

    const items: IDropdownMenu['items'] = [
        {
            key: 'dashboard',
            label: <p>Tài khoản của tôi</p>,
            onClick: () => {
                router.push(NAVIGATION_PATHS.DASH_BOARD_NGUOI_THUE)
            },
        },
        {
            key: 'logout',
            label: <p>Đăng xuất</p>,
            onClick: () => {
                setIsConfirmLogout(true)
            },
        },
    ]

    const HEADER_MENU = [
        {
            key: 'NAVIGATION_PATHS.FIELDS',
            label: 'Danh sách sân bóng',
            href: NAVIGATION_PATHS.FIELD_LIST,
        },
        // {
        //     key: 'NAVIGATION_PATHS.EXCHANGE',
        //     label: 'Giao lưu',
        //     href: 'NAVIGATION_PATHS.EXCHANGE',
        // },
        {
            key: 'NAVIGATION_PATHS.ABOUT',
            label: 'Giới thiệu',
            href: NAVIGATION_PATHS.ABOUT,
        },
        {
            key: 'NAVIGATION_PATHS.SUPPORT',
            label: 'Hỗ trợ',
            href: NAVIGATION_PATHS.SUPPORT,
        },
    ]

    const renderMenuLinks = () => (
        <nav className={styles.menu_area}>
            {HEADER_MENU.map((item) => (
                <Link
                    key={item.key}
                    href={item.href}
                    // className={styles.menu_link}
                    className={
                        pathname.includes(item.href)
                            ? `${styles.menu_link} ${styles.active}`
                            : styles.menu_link
                    }
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    )

    return (
        <>
            <header className={`${styles.header} bg-white`}> 
                <div className={`${styles.logo_area} flex items-center`}> 
                    <Link href={NAVIGATION_PATHS.HOME}>
                        <Logo />
                    </Link>
                </div>
                {!isMobile && (
                    <div className={`${styles.desktop_menu} flex-1`}>{renderMenuLinks()}</div>
                )}
                <div className={`${styles.right_area} flex items-center gap-4`}>
                    {/* <SwitchLanguage /> */}
                    {!isMobile &&
                        (!isAuthenticated ? (
                            <Button
                                type="primary"
                                size="small"
                                onClick={showModal}
                                className={styles.login_btn}
                            >
                                Đăng nhập
                            </Button>
                        ) : (
                            <Dropdown
                                menu={{ items }}
                                placement="bottomRight"
                                trigger={['hover']}
                            >
                                <div className={styles.avatar_wrapper}>
                                    <AvatarUser size={36} userInfo={user} />
                                </div>
                            </Dropdown>
                        ))}
                    {isMobile && (
                        <button
                            className={`${styles.mobile_menu_btn} p-2 text-gray-700`}
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label="Open menu"
                        >
                            {mobileMenuOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
                        </button>
                    )}
                </div>
            </header>
            {isMobile && mobileMenuOpen && (
                <div className={`${styles.mobile_menu_overlay} fixed inset-0 bg-black/20`} onClick={() => setMobileMenuOpen(false)}>
                    <div className={`${styles.mobile_menu_drawer} bg-white w-full min-w-[220px] shadow-md p-6`} onClick={(e) => e.stopPropagation()}>
                        <div className={`${styles.mobile_menu_links} flex flex-col gap-2`}>
                            {renderMenuLinks()}
                            {!isAuthenticated ? (
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => {
                                        showModal()
                                        setMobileMenuOpen(false)
                                    }}
                                    className={styles.login_btn}
                                >
                                    Đăng nhập
                                </Button>
                            ) : (
                                <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
                                    <div className={styles.avatar_wrapper}>
                                        <AvatarUser size={36} userInfo={user} />
                                        <p className={styles.user_name}>{user?.hoTen}</p>
                                    </div>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <ModalConfirm
                open={isConfirmLogout}
                onCancel={setIsConfirmLogout}
                title={t('logout')}
                description={t('confirmLogout')}
                onClickConfirm={handleLogout}
            />

            <LoginModal
                visible={isLoginModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            />
        </>
    )
}

export default Header
