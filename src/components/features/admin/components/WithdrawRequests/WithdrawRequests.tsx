/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { yeuCauRutTienService } from '@/core/services/API/YeuCauRutTien/YeuCauRutTien.service'
import styles from './WithdrawRequests.module.scss'
import Button from '@/components/ui/Button/Button'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import dayjs from 'dayjs'
import Select from '@/components/ui/Select/Select'
import Input from '@/components/ui/TextField/TextField'
import Pagination from '@/components/ui/Pagination/Pagination'
import ModalConfirm from '@/components/features/home/ModalConfirm'
import { showMessage } from '@/components/ui/Notification/Notification'
import { useDebounce } from '@/hooks/useDebounce'

const trangThaiOptions = [
    { label: 'Tất cả', value: '' },
    { label: 'Chờ xử lý', value: 'CHO_XU_LY' },
    { label: 'Đã xử lý', value: 'DA_XU_LY' },
]

const WithdrawRequests = () => {
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const debounceSearchFn = useDebounce((value: string) => {
        setDebouncedSearch(value)
    }, 400)
    const [trangThai, setTrangThai] = useState('')
    const [fromDate, setFromDate] = useState<string | undefined>(undefined)
    const [toDate, setToDate] = useState<string | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; id?: string }>({ open: false })
    const pageSize = 12

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, trangThai, fromDate, toDate])

    const {
        data: withdrawRequests = {},
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [
            'yeu-cau-rut-tien-admin',
            debouncedSearch,
            trangThai,
            fromDate,
            toDate,
            currentPage,
            pageSize,
        ],
        queryFn: () =>
            yeuCauRutTienService.getAllYeuCauRutTien({
                page: currentPage,
                limit: pageSize,
                search: debouncedSearch || undefined,
                trangThai: trangThai || undefined,
                fromDate,
                toDate,
            }),
    })

    const { mutate: approveMutation, isPending: isApproving } = useMutation({
        mutationFn: (id: string) => yeuCauRutTienService.approveYeuCauRutTien(id),
        onSuccess: () => {
            refetch()
            showMessage('success', 'Xác nhận chuyển tiền thành công!')
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận chuyển tiền.'
            showMessage('error', errorMessage)
        },
    })

    const handleApprove = (id: string) => {
        approveMutation(id)
    }

    const getStatusClass = (status: string) => {
        if (status === 'CHO_XU_LY') return styles.status_pending
        if (status === 'DA_XU_LY') return styles.status_done
        return ''
    }

    const handleOpenConfirm = (id: string) => {
        setConfirmModal({ open: true, id })
    }
    
    const handleCloseConfirm = () => {
        setConfirmModal({ open: false })
    }

    const handleConfirmApprove = () => {
        if (confirmModal.id) {
            handleApprove(confirmModal.id)
        }
        setConfirmModal({ open: false })
    }

    const withdrawList = withdrawRequests?.data || []
    const total = withdrawRequests?.total || 0

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Yêu cầu rút tiền</h2>
            <div className={styles.filter_row}>
                <Input
                    name="search"
                    placeholder="Tìm kiếm theo tên..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        debounceSearchFn(e.target.value)
                    }}
                    className={styles.filter_input}
                />
                <Select
                    value={trangThai}
                    onChange={(val) => setTrangThai(val)}
                    className={styles.filter_select}
                    style={{ minWidth: 150 }}
                >
                    {trangThaiOptions.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                        </Select.Option>
                    ))}
                </Select>
                <DatePicker
                    allowClear
                    placeholder="Từ ngày"
                    value={fromDate ? dayjs(fromDate) : undefined}
                    onChange={(d) =>
                        setFromDate(d ? d.format('YYYY-MM-DD') : undefined)
                    }
                    className={styles.filter_datepicker}
                />
                <DatePicker
                    allowClear
                    placeholder="Đến ngày"
                    value={toDate ? dayjs(toDate) : undefined}
                    onChange={d =>
                        setToDate(d ? d.format('YYYY-MM-DD') : undefined)
                    }
                    className={styles.filter_datepicker}
                    disabledDate={current => {
                        if (!fromDate) return false
                        return current && (current.isSame(dayjs(fromDate), 'day') || current.isBefore(dayjs(fromDate), 'day'))
                    }}
                />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Vai trò</th>
                        <th>Số tiền muốn rút</th>
                        <th>Số tiền thực tế (trừ 10%)</th>
                        <th>Ngân hàng</th>
                        <th>Số tài khoản</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className={styles.no_data}>
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : withdrawList.length === 0 ? (
                        <tr>
                            <td colSpan={6} className={styles.no_data}>
                                Không có yêu cầu rút tiền nào
                            </td>
                        </tr>
                    ) : (
                        withdrawList.map((req: any) => (
                            <tr key={req.maYeuCau}>
                                <td>{req.maNguoiDung?.hoTen || '-'}</td>
                                <td>{req.maNguoiDung?.vaiTro || '-'}</td>
                                <td>
                                    {Number(req.soTien).toLocaleString('vi-VN')}{' '}
                                    đ
                                </td>
                                <td>
                                    {Number(
                                        req.soTienThucTeCanChuyen || 0
                                    ).toLocaleString('vi-VN')}{' '}
                                    đ
                                </td>
                                <td>{req.tenNganHang}</td>
                                <td>{req.soTaiKhoan}</td>
                                <td>
                                    <span
                                        className={getStatusClass(
                                            req.trangThai
                                        )}
                                    >
                                        {req.trangThai === 'CHO_XU_LY'
                                            ? 'Chờ xử lý'
                                            : req.trangThai === 'DA_XU_LY'
                                              ? 'Đã xử lý'
                                              : req.trangThai}
                                    </span>
                                </td>
                                <td>
                                    <Button
                                        type="primary"
                                        size="small"
                                        shape="square"
                                        className={styles.approve_btn}
                                        onClick={() =>
                                            handleOpenConfirm(req.maYeuCau)
                                        }
                                        disabled={req.trangThai === 'DA_XU_LY'}
                                    >
                                        Đã chuyển tiền
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className={styles.pagination_wrapper}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    size="small"
                />
            </div>
            <ModalConfirm
                open={confirmModal.open}
                onCancel={handleCloseConfirm}
                onClickConfirm={handleConfirmApprove}
                title="Xác nhận chuyển tiền"
                description="Bạn có chắc chắn đã chuyển tiền cho yêu cầu này?"
                loading={isApproving}
            />
        </div>
    )
}

export default WithdrawRequests
