/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useEffect, useRef, useState } from 'react'
import { Form } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import dayjs from 'dayjs'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Button from '@/components/ui/Button/Button'
import { paymentService } from '@/core/services/API/Payment/Payment.service'
import { paymentHistoryService } from '@/core/services/API/PaymentHistory/PaymentHistory.service'
import { showMessage } from '@/components/ui/Notification/Notification'
import Pagination from '@/components/ui/Pagination/Pagination'
import styles from './Recharge.module.scss'
import { useAuth } from '@/contexts/auth/AuthContext'
import { yeuCauRutTienService } from '@/core/services/API/YeuCauRutTien/YeuCauRutTien.service'

const PAGE_SIZE = 5

const Recharge = () => {
    const [form] = Form.useForm()
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const notifiedRef = useRef(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [showWithdrawForm, setShowWithdrawForm] = useState(false)
    const [withdrawForm] = Form.useForm()

    const { data: depositHistoryRaw, isLoading: isLoadingHistory } = useQuery({
        queryKey: [
            'payment-history',
            user?.maNguoiDung,
            currentPage,
            PAGE_SIZE,
        ],
        queryFn: () =>
            paymentHistoryService.getAllDeposits(user?.maNguoiDung, {
                page: currentPage,
                limit: PAGE_SIZE,
            }),
        enabled: !!user?.maNguoiDung,
    })

    // Đảm bảo depositHistory luôn là mảng
    const depositHistory = Array.isArray(depositHistoryRaw)
        ? depositHistoryRaw
        : depositHistoryRaw?.data || depositHistoryRaw?.items || []

    // Tổng số bản ghi (nếu API trả về)
    const total =
        depositHistoryRaw?.total ||
        depositHistoryRaw?.totalDocs ||
        depositHistoryRaw?.total ||
        0

    useEffect(() => {
        if (notifiedRef.current) return
        const success = searchParams.get('success')
        const amount = searchParams.get('amount')
        if (success === 'true') {
            showMessage(
                'success',
                `Bạn đã nạp thành công ${Number(amount).toLocaleString('vi-VN')}đ vào hệ thống`
            )
            notifiedRef.current = true
        } else if (success === 'false') {
            showMessage('error', 'Nạp tiền thất bại')
            notifiedRef.current = true
        }
        // Xóa các query param sau khi thông báo
        if (success === 'true' || success === 'false') {
            router.replace(pathname, { scroll: false })
        }
    }, [searchParams, router])

    const { mutate: createPaymentUrl, isPending } = useMutation({
        mutationFn: async (amount: number) => {
            return await paymentService.createPaymentUrl(amount)
        },
        onSuccess: (res: any) => {
            if (res?.data?.url) {
                window.location.href = res?.data?.url
            } else {
                showMessage('error', 'Không lấy được link thanh toán!')
            }
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                'Có lỗi khi tạo yêu cầu nạp tiền!'
            showMessage('error', errorMessage)
        },
    })

    const { mutate: createWithdrawMutation, isPending: isCreatingWithdraw } = useMutation({
        mutationFn: (data: { soTien: number; tenNganHang: string; soTaiKhoan: string; moTa?: string }) =>
            yeuCauRutTienService.createYeuCauRutTien(data),
        onSuccess: () => {
            showMessage('success', 'Yêu cầu rút tiền đã được gửi thành công!')
            setShowWithdrawForm(false)
            withdrawForm.resetFields()
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
            showMessage('error', errorMessage)
            console.error('Error creating withdraw request:', error)
        },
    })

    const handleFinish = (values: any) => {
        createPaymentUrl(values.amount)
    }

    const handleWithdraw = (values: any) => {
        const payload = {
            soTien: values.soTien,
            tenNganHang: values.tenNganHang,
            soTaiKhoan: values.soTaiKhoan,
        }
        createWithdrawMutation(payload)
    }

    return (
        <div className={styles.recharge_wrapper}>
            <div className={styles.balance_box}>
                <span>Số dư tài khoản:</span>
                <span className={styles.balance_amount}>
                    {user?.soDuTaiKhoan?.toLocaleString('vi-VN')} đ
                </span>
            </div>
            {!showWithdrawForm ? (
                <Form
                    form={form}
                    layout="vertical"
                    className={styles.recharge_form}
                    onFinish={handleFinish}
                >
                    <div className={styles.form_group}>
                        <label htmlFor="matKhau" className={styles.label}>
                            Số tiền cần nạp{' '}
                            <span className={styles.required}>*</span>
                        </label>
                        <InputFormItem
                            name="amount"
                            type="currency"
                            required
                            requiredMessage="Vui lòng nhập số tiền cần nạp"
                            placeholder="Nhập số tiền (VNĐ)"
                            classNameInput={styles.input}
                        />
                    </div>
                    <div className={styles.action_group}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.recharge_btn}
                            loading={isPending}
                        >
                            Nạp tiền
                        </Button>
                        <Button
                            type="default"
                            className={styles.recharge_btn}
                            onClick={() => setShowWithdrawForm(true)}
                        >
                            Rút tiền
                        </Button>
                    </div>
                </Form>
            ) : (
                <Form
                    form={withdrawForm}
                    layout="vertical"
                    className={`${styles.recharge_form} ${styles.withdraw_form}`}
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
                    <div className={styles.withdraw_action_group}>
                        <Button
                            type="default"
                            onClick={() => setShowWithdrawForm(false)}
                        >
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={isCreatingWithdraw} className={styles.submit_btn}>
                            {!isCreatingWithdraw && 'Gửi yêu cầu'}
                        </Button>
                    </div>
                </Form>
            )}
            <div className={styles.history_wrapper}>
                <div className={styles.history_title}>Lịch sử nạp tiền</div>
                <table className={styles.history_table}>
                    <thead>
                        <tr>
                            <th>Số tiền</th>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingHistory ? (
                            <tr>
                                <td colSpan={3} className={styles.no_data}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : !depositHistory || depositHistory.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={styles.no_data}>
                                    Chưa có lịch sử nạp tiền
                                </td>
                            </tr>
                        ) : (
                            depositHistory.map((item: any) => (
                                <tr
                                    key={
                                        item.maNapTien ||
                                        item.maGiaoDich ||
                                        item._id
                                    }
                                >
                                    <td>
                                        {Number(item.soTien).toLocaleString(
                                            'vi-VN'
                                        )}{' '}
                                        đ
                                    </td>
                                    <td>
                                        {item?.thoiGianNap
                                            ? dayjs(item.thoiGianNap).format(
                                                  'HH:mm DD/MM/YYYY'
                                              )
                                            : ''}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                item?.trangThai === 'success'
                                                    ? styles.status_success
                                                    : styles.status_pending
                                            }
                                        >
                                            {item?.trangThai === 'success'
                                                ? 'Thành công'
                                                : 'Đang xử lý'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className={styles.pagination_wrapper}>
                    <Pagination
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={total}
                        onChange={setCurrentPage}
                        showSizeChanger={false}
                        size="small"
                    />
                </div>
            </div>
        </div>
    )
}

export default Recharge
