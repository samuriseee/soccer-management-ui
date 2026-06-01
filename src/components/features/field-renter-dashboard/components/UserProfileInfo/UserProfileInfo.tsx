/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import styles from './UserProfileInfo.module.scss'
import { Form } from 'antd'
import { useState, useEffect, useRef } from 'react'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Button from '@/components/ui/Button/Button'
import { authenticationService } from '@/core/services/API/authentication/Authentication.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AvatarUser from '@/components/ui/AvatarUser/AvatarUser'
import { useAuth, AuthActionType } from '@/contexts/auth/AuthContext'
import { showMessage } from '@/components/ui/Notification/Notification'

export default function UserProfileInfo() {
    const [form] = Form.useForm()
    const [isEditing, setIsEditing] = useState(false)

    const queryClient = useQueryClient()
    const { data: user, isLoading } = useQuery({
        queryKey: ['getInformationUser'],
        queryFn: authenticationService.getInformationUser,
    })

    const { dispatch } = useAuth()

    const { mutate: updateMutation, isPending: isUpdating } = useMutation({
        mutationFn: async (values: any) => {
            if (!user?.maNguoiDung) return
            await authenticationService.updateInfoUser({
                maNguoiDung: user.maNguoiDung,
                hoTen: values.hoTen,
                soDienThoai: values.soDienThoai,
                avatar: avatarFile || undefined,
            })
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['getInformationUser'] })
            const updatedUser = await authenticationService.getInformationUser()
            dispatch({ type: AuthActionType.INITIALIZE, payload: { isAuthenticated: true, user: updatedUser } })
            showMessage('success', 'Cập nhật thông tin thành công!')
            setIsEditing(false)
            setAvatarFile(null)
        },
        onError: (error: any) => {
            console.error('Error updating user info:', error)
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
            showMessage('error', errorMessage)
        },
    })

    console.log('User data:', user)
    
    useEffect(() => {
        if (user) {
            form.setFieldsValue(user)
        }
    }, [user, form])

    const handleSubmit = (values: any) => {
        const payload = {
            ...values,
            avatar: avatarFile ? avatarFile : undefined,
        }
        updateMutation(payload)
    }

    // Thêm state cho file avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Khi chọn file mới, tạo preview
    useEffect(() => {
        if (avatarFile) {
            const url = URL.createObjectURL(avatarFile)
            setAvatarPreview(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setAvatarPreview(null)
        }
    }, [avatarFile])

    // Xử lý click vào avatar
    const handleAvatarClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    // Xử lý chọn file
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarFile(file)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.card_header}>
                    <h1 className={styles.card_title}>Thông tin người dùng</h1>
                    <p className={styles.card_description}>
                        Xem và cập nhật thông tin cá nhân của bạn
                    </p>
                </div>

                <div className={styles.card_content}>
                    <div className={styles.avatar_wrapper}>
                        <div onClick={handleAvatarClick} style={{ cursor: isEditing ? 'pointer' : 'default' }}>
                            <AvatarUser
                                userInfo={avatarPreview ? { ...user, avatar: avatarPreview } : user}
                                size={90}
                            />
                            {isEditing && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                />
                            )}  
                        </div>
                    </div>
                    {isLoading ? (
                        <div>Đang tải thông tin người dùng...</div>
                    ) : (
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                            initialValues={user}
                            className={styles.form_grid}
                        >
                            <div className={styles.form_group}>
                                <label htmlFor="hoTen" className={styles.label}>
                                    Họ và tên
                                </label>
                                <InputFormItem
                                    name="hoTen"
                                    placeholder="Nhập họ tên"
                                    type="full_name"
                                    disabled={!isEditing}
                                    required
                                    requiredMessage="Vui lòng nhập họ tên"
                                    classNameInput={styles.input}
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <InputFormItem
                                    name="email"
                                    placeholder="Nhập email"
                                    type="email"
                                    disabled
                                    required
                                    requiredMessage="Vui lòng nhập email"
                                    classNameInput={styles.input}
                                />
                            </div>

                            <div className={styles.form_group}>
                                <label
                                    htmlFor="soDienThoai"
                                    className={styles.label}
                                >
                                    Số điện thoại
                                </label>
                                <InputFormItem
                                    name="soDienThoai"
                                    placeholder="Nhập số điện thoại"
                                    type="phone"
                                    disabled={!isEditing}
                                    required
                                    requiredMessage="Vui lòng nhập số điện thoại"
                                    classNameInput={styles.input}
                                />
                            </div>

                            {isEditing && (
                                <div className={styles.button_group}>
                                    <Button
                                        type="default"
                                        shape="square"
                                        className={`${styles.button} ${styles.button_outline}`}
                                        onClick={() => {
                                            form.setFieldsValue(user)
                                            setIsEditing(false)
                                        }}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        shape="square"
                                        className={styles.button}
                                        loading={isUpdating}
                                    >
                                        {!isUpdating && 'Lưu thay đổi'}
                                    </Button>
                                </div>
                            )}
                        </Form>
                    )}
                </div>

                {!isEditing && (
                    <div className={styles.card_footer}>
                        <Button
                            className={styles.button}
                            shape="square"
                            type="primary"
                            onClick={() => setIsEditing(true)}
                        >
                            Chỉnh sửa thông tin
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
