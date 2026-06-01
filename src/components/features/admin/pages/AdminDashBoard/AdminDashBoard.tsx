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
import { User, Settings, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react'
import styles from './AdminDashBoard.module.scss'
import Sidebar, { MenuItem } from '@/components/layout/SideBar/SideBar'
import { useAuth } from '@/contexts/auth/AuthContext'
import ApproveSanBongList from '../../components/ApproveSanBongList/ApproveSanBongList'
import AdminManageTimeSlots from '../../components/AdminManageTimeSlots/AdminManageTimeSlots'
import WithdrawRequests from '../../components/WithdrawRequests/WithdrawRequests'
import ReportList from '../../components/ReportList/ReportList'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { signOut } from '@/contexts/auth/reducers'
import { showMessage } from '@/components/ui/Notification/Notification'
import ModalConfirm from '@/components/features/home/ModalConfirm'

const AdminDashBoard = () => {
    const { user, dispatch } = useAuth()
    const [activeContent, setActiveContent] = useState<string>('approveSanBong')
    const [isConfirmLogout, setIsConfirmLogout] = useState(false)

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

    const menuItems: MenuItem[] = [
        {
            id: 'approveSanBong',
            label: 'Duyệt sân bóng',
            icon: <CheckCircle2 size={20} />,
        },
        {
            id: 'manageTimeSlots',
            label: 'Quản lý khung giờ sân bóng',
            icon: <Settings size={20} />,
        },
        {
            id: 'withdrawRequests',
            label: 'Yêu cầu rút tiền',
            icon: <User size={20} />,
        },
        {
            id: 'reportList',
            label: 'Báo cáo',
            icon: <AlertTriangle size={20} />,
        },
    ]

    const bottomMenuItems: MenuItem[] = [
        {
            id: 'logout',
            label: 'Đăng xuất',
            icon: <LogOut size={20} />,
            onClick: () => {
                setIsConfirmLogout(true)
            },
        },
    ]

    const handleMenuClick = (itemId: string) => {
        setActiveContent(itemId)
    }

    const renderContent = () => {
        switch (activeContent) {
            case 'approveSanBong':
                return <ApproveSanBongList />
            case 'manageTimeSlots':
                return <AdminManageTimeSlots />
            case 'withdrawRequests':
                return <WithdrawRequests />
            case 'reportList':
                return <ReportList />
            default:
                return null
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

export default AdminDashBoard
