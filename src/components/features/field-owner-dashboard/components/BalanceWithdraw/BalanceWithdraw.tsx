/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import styles from './BalanceWithdraw.module.scss'
import Button from '@/components/ui/Button/Button'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import { Form } from 'antd'
import { useQuery, useMutation } from '@tanstack/react-query'
import { yeuCauRutTienService } from '@/core/services/API/YeuCauRutTien/YeuCauRutTien.service'
import { showMessage } from '@/components/ui/Notification/Notification'

const BalanceWithdraw = () => {
    const [showForm, setShowForm] = useState(false)
    const [form] = Form.useForm()

    const {
        data: soDuChuSan,
        isFetching: isFetchingBalance,
        refetch: refetchBalance,
    } = useQuery<{ soDuTaiKhoan: number; soDuKhaDung: number }>({
        queryKey: ['so-du-chu-san'],
        queryFn: () => yeuCauRutTienService.getSoDuTaiKhoan(),
    })

    const { mutate: createWithdrawMutation, isPending: isCreatingWithdraw } =
        useMutation({
            mutationFn: (data: {
                soTien: number
                tenNganHang: string
                soTaiKhoan: string
                moTa?: string
            }) => yeuCauRutTienService.createYeuCauRutTien(data),
            onSuccess: () => {
                showMessage(
                    'success',
                    'Yêu cầu rút tiền đã được gửi thành công!'
                )
                setShowForm(false)
                form.resetFields()
                refetchBalance()
            },
            onError: (error: any) => {
                const errorMessage =
                    error?.response?.data?.message ||
                    'Có lỗi xảy ra, vui lòng thử lại sau.'
                showMessage('error', errorMessage)
                console.error('Error creating withdraw request:', error)
            },
        })

    const handleWithdraw = (values: any) => {
        const payload = {
            soTien: values.soTien,
            tenNganHang: values.tenNganHang,
            soTaiKhoan: values.soTaiKhoan,
        }
        console.log('Submitting withdraw request:', payload)

        createWithdrawMutation(payload)
    }

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Số dư tài khoản</h2>
            <div className={styles.balance_box}>
                <span>Số dư hiện tại:</span>
                <span className={styles.balance_amount}>
                    {soDuChuSan?.soDuTaiKhoan?.toLocaleString('vi-VN') || 0} đ
                </span>
            </div>
            <div className={styles.available_balance_box}>
                <span>Số dư khả dụng:</span>
                <span className={styles.available_balance_amount}>
                    {soDuChuSan?.soDuKhaDung?.toLocaleString('vi-VN') || 0} đ
                </span>
            </div>
            {!showForm ? (
                <Button
                    type="primary"
                    className={styles.withdraw_btn}
                    onClick={() => setShowForm(true)}
                >
                    Yêu cầu rút tiền
                </Button>
            ) : (
                <Form
                    form={form}
                    layout="vertical"
                    className={styles.withdraw_form}
                    onFinish={handleWithdraw}
                >
                    <div className={styles.form_group}>
                        <InputFormItem
                            name="tenNganHang"
                            required
                            requiredMessage="Vui lòng nhập tên ngân hàng"
                            placeholder="Tên ngân hàng"
                            classNameInput={styles.input}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <InputFormItem
                            name="soTaiKhoan"
                            required
                            requiredMessage="Vui lòng nhập số tài khoản"
                            placeholder="Số tài khoản"
                            classNameInput={styles.input}
                        />
                    </div>
                    <div className={styles.form_group}>
                        <InputFormItem
                            name="soTien"
                            type="currency"
                            required
                            requiredMessage="Vui lòng nhập số tiền muốn rút"
                            placeholder="Số tiền muốn rút (VNĐ)"
                            classNameInput={styles.input}
                        />
                    </div>
                    <div className={styles.action_group}>
                        <Button
                            type="default"
                            onClick={() => {
                                setShowForm(false)
                                form.resetFields()
                            }}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isCreatingWithdraw}
                            className={styles.submit_btn}
                        >
                            {!isCreatingWithdraw && 'Gửi yêu cầu'}
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default BalanceWithdraw
