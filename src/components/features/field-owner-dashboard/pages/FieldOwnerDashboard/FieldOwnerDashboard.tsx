/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import { useState } from 'react'
import {
    Calendar,
    BarChart3,
    Layers,
    User,
    Settings,
    LogOut,
    ClipboardList,
} from 'lucide-react'
import styles from './FieldOwnerDashboard.module.scss'
import Sidebar, { MenuItem } from '@/components/layout/SideBar/SideBar'
import BookingContent from '../../components/BookingContent/BookingContent'
import FieldContent from '../../components/FieldContent/FieldContent'
import ReportContent from '../../components/ReportContent/ReportContent'
import FootballFieldInfo from '../../components/FootballFieldInfo/FootballFieldInfo'
import BalanceWithdraw from '../../components/BalanceWithdraw/BalanceWithdraw'
import { useAuth } from '@/contexts/auth/AuthContext'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { showMessage } from '@/components/ui/Notification/Notification'
import { signOut } from '@/contexts/auth/reducers'
import ModalConfirm from '@/components/features/home/ModalConfirm'

const FieldOwnerDashboard = () => {
    const [activeContent, setActiveContent] = useState<string>('fieldInfo')
    const [isConfirmLogout, setIsConfirmLogout] = useState(false)

    const { user, dispatch } = useAuth()

    const handleLogout = async () => {
        try {
            await authenticationService.logoutUser()
            dispatch(signOut())
            setIsConfirmLogout(false)
            showMessage('success', 'Đăng xuất thành công!')
        } catch (error) {
            showMessage(
                'error',
                'Có lỗi xảy ra khi đăng xuất, vui lòng thử lại sau.'
            )
        }
    }

    // Menu items cho chủ sân
    const menuItems: MenuItem[] = [
        {
            id: 'fieldInfo',
            label: 'Thông tin sân bóng',
            icon: <ClipboardList size={20} />,
        },
        {
            id: 'booking',
            label: 'Quản lý đặt sân',
            icon: <Calendar size={20} />,
        },
        {
            id: 'field',
            label: 'Quản lý sân',
            icon: <Layers size={20} />,
        },
        {
            id: 'report',
            label: 'Báo cáo',
            icon: <BarChart3 size={20} />,
        },
        {
            id: 'balanceWithdraw',
            label: 'Số dư & Rút tiền',
            icon: <User size={20} />,
        },
    ]

    // Menu items phía dưới
    const bottomMenuItems: MenuItem[] = [
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
            onClick: () => {
                setIsConfirmLogout(true)
            }
        },
    ]

    const handleMenuClick = (itemId: string) => {
        setActiveContent(itemId)
    }

    const renderContent = () => {
        switch (activeContent) {
            case 'fieldInfo':
                return <FootballFieldInfo />
            case 'booking':
                return <BookingContent />
            case 'field':
                return <FieldContent />
            case 'report':
                return <ReportContent />
            case 'balanceWithdraw':
                return <BalanceWithdraw />
            case 'profile':
                return (
                    <div className={styles.placeholder_content}>
                        Thông tin cá nhân
                    </div>
                )
            case 'settings':
                return <div className={styles.placeholder_content}>Cài đặt</div>
            default:
                return <FootballFieldInfo />
        }
    }

    return (
        <>
            <div className={styles.main_container}>
                <Sidebar
                    user={user}
                    menuItems={menuItems}
                    bottomMenuItems={bottomMenuItems}
                    activeItem={activeContent}
                    onMenuItemClick={handleMenuClick}
                />
                <div className={styles.content_area}>{renderContent()}</div>
            </div>
            <ModalConfirm
                open={isConfirmLogout}
                onCancel={setIsConfirmLogout}
                title={'Đăng xuất'}
                description={'Bạn có chắc chắn muốn đăng xuất?'}
                onClickConfirm={handleLogout}
            />
        </>
    )
}

export default FieldOwnerDashboard
