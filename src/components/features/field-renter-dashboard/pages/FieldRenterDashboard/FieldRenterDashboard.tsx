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
    User,
    Lock,
    Search,
    Calendar,
    Users,
    Heart,
    Settings,
    LogOut,
    DollarSign,
    ArrowDownCircle,
    Home,
} from 'lucide-react'
import styles from './FieldRenterDashboard.module.scss'
import UserProfileInfo from '../../components/UserProfileInfo/UserProfileInfo'
import ChangePassword from '../../components/ChangePassword/ChangePassword'
import Sidebar, { MenuItem } from '@/components/layout/SideBar/SideBar'
import { useAuth } from '@/contexts/auth/AuthContext'
import Recharge from '../../components/Recharge/Recharge'
import BookingHistory from '../../components/BookingHistory/BookingHistory'
import Button from '@/components/ui/Button/Button'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { signOut } from '@/contexts/auth/reducers'
import { showMessage } from '@/components/ui/Notification/Notification'
import ModalConfirm from '@/components/features/home/ModalConfirm'

const FieldRenterDashboard = ({
    selectContent = 'RECHARGE',
}: {
    selectContent?: string
}) => {
    const [selectedContent, setSelectedContent] = useState(selectContent)
    const [isConfirmLogout, setIsConfirmLogout] = useState(false)

    const { user, dispatch } = useAuth()
    const router = useRouter()

    const handleBackHome = () => {
        router.push(NAVIGATION_PATHS.HOME)
    }

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

    // Menu items cho người thuê sân
    const menuItems: MenuItem[] = [
        {
            id: 'RECHARGE',
            label: 'Nạp tiền',
            icon: <ArrowDownCircle size={20} />,
        },
        {
            id: 'BOOKING_HISTORY',
            label: 'Lịch sử đặt sân',
            icon: <Calendar size={20} />,
        },
        // {
        //     id: 'FIELD_LIST',
        //     label: 'Danh sách sân bóng',
        //     icon: <Search size={20} />,
        // },
        // {
        //     id: 'FIND_OPPONENTS',
        //     label: 'Giao lưu - Tìm đối',
        //     icon: <Users size={20} />,
        // },
        // {
        //     id: 'FAVORITE_FIELDS',
        //     label: 'Sân yêu thích',
        //     icon: <Heart size={20} />,
        // },
    ]

    // Menu items phía dưới
    const bottomMenuItems: MenuItem[] = [
        {
            id: 'PROFILE',
            label: 'Thông tin cá nhân',
            icon: <User size={20} />,
        },
        {
            id: 'CHANGE_PASSWORD',
            label: 'Đổi mật khẩu',
            icon: <Lock size={20} />,
        },
        // {
        //     id: 'SETTINGS',
        //     label: 'Cài đặt',
        //     icon: <Settings size={20} />,
        // },
        {
            id: 'LOGOUT',
            label: 'Đăng xuất',
            icon: <LogOut size={20} />,
            onClick: () => {
                setIsConfirmLogout(true)
            },
        },
    ]

    const handleMenuClick = (itemId: string) => {
        setSelectedContent(itemId)
    }

    const renderContent = () => {
        switch (selectedContent) {
            case 'PROFILE':
                return <UserProfileInfo />
            case 'CHANGE_PASSWORD':
                return <ChangePassword />
            case 'RECHARGE':
                return <Recharge />
            case 'BOOKING_HISTORY':
                return <BookingHistory />
            // case 'FIELD_LIST':
            //     return (
            //         <div className={styles.placeholder_content}>
            //             Danh sách sân bóng
            //         </div>
            //     )
            // case 'FIND_OPPONENTS':
            //     return (
            //         <div className={styles.placeholder_content}>
            //             Giao lưu - Tìm đối
            //         </div>
            //     )
            // case 'FAVORITE_FIELDS':
            //     return (
            //         <div className={styles.placeholder_content}>
            //             Sân yêu thích
            //         </div>
            //     )
            // case 'SETTINGS':
            //     return (
            //         <div className={styles.placeholder_content}>
            //             Trang cài đặt đang được phát triển
            //         </div>
            //     )
            // case 'LOGOUT':
            //     // In a real app, you would handle logout logic here
            //     return (
            //         <div className={styles.placeholder_content}>
            //             Đang đăng xuất...
            //         </div>
            //     )
            default:
                return (
                    <div className={styles.placeholder_content}>
                        Chào mừng bạn đến với trang cá nhân
                    </div>
                )
        }
    }

    return (
        <>
            <div className={styles.field_renter_dashboard_wrapper}>
                <Sidebar
                    user={user}
                    menuItems={menuItems}
                    bottomMenuItems={bottomMenuItems}
                    activeItem={selectedContent}
                    onMenuItemClick={handleMenuClick}
                />
                <div className={styles.field_renter_dashboard_content}>
                    <div className={styles.dashboard_header}>
                        <Button
                            type="default"
                            className={styles.back_home_btn}
                            onClick={handleBackHome}
                            icon={<Home size={18} />}
                        >
                            Quay lại trang chủ
                        </Button>
                    </div>
                    {renderContent()}
                </div>
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

export default FieldRenterDashboard
