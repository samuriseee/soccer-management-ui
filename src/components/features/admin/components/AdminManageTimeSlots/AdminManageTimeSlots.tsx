/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import styles from './AdminManageTimeSlots.module.scss'
import Input from '@/components/ui/TextField/TextField'
import Select from '@/components/ui/Select/Select'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import Pagination from '@/components/ui/Pagination/Pagination'
import Switch from '@/components/ui/Switch/Switch'
import dayjs from 'dayjs'
import { showMessage } from '@/components/ui/Notification/Notification'

interface SlotItem {
    maChiTietDatSan: string
    gioBatDau: string
    gioKetThuc: string
    trangThaiDatSan: string
    coVanDe: boolean
    maSanChiTiet: {
        tenSanChiTiet: string
        maSanBong: {
            tenSan: string
        }
    }
    maDatSan: {
        ngayDat: string
    }
    nguoiThue: {
        hoTen: string
        soDienThoai: string
    }
}

const statusOptions = [
    { label: 'Tất cả trạng thái', value: 'all' },
    { label: 'Đã xác nhận', value: 'DA_DAT' },
    { label: 'Đã hủy', value: 'DA_HUY' },
    { label: 'Hoàn thành', value: 'DA_HOAN_THANH' },
    { label: 'Có vấn đề', value: 'CO_VAN_DE' },
]

const getStatusText = (status: string) => {
    switch (status) {
        case 'DA_DAT':
            return 'Đã xác nhận'
        case 'DA_HUY':
            return 'Đã hủy'
        case 'DA_HOAN_THANH':
            return 'Hoàn thành'
        case 'CO_VAN_DE':
            return 'Có vấn đề'
        default:
            return status
    }
}

const AdminManageTimeSlots = () => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const [date, setDate] = useState<string | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const { data, isLoading, refetch } = useQuery({
        queryKey: [
            'admin-slots',
            search,
            status,
            date,
            currentPage,
            itemsPerPage,
        ],
        queryFn: () =>
            timeSlotsService.getAllSlotsForAdmin({
                search: search || undefined,
                trangThaiDatSan: status !== 'all' ? status : undefined,
                ngayDat: date,
                page: currentPage,
                limit: itemsPerPage,
            }),
    })

    const slots: SlotItem[] = Array.isArray(data?.data) ? data.data : []
    const total = data?.total || 0

    const { mutate: setCoVanDeMutate, isPending: isSetCoVanDePending } = useMutation({
        mutationFn: (params: { maChiTietDatSan: string; coVanDe: boolean }) =>
            timeSlotsService.setCoVanDeForSlot(params),
        onSuccess: () => {
            refetch()
            showMessage('success', 'Cập nhật thành công')
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message ||
                'Có lỗi xảy ra khi cập nhật trạng thái vấn đề.'
            showMessage('error', errorMessage)
        },
    })

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DA_DAT':
                return styles.status_confirmed
            case 'DA_HUY':
                return styles.status_cancelled
            case 'DA_HOAN_THANH':
                return styles.status_done
            case 'CO_VAN_DE':
                return styles.status_problem
            default:
                return ''
        }
    }

    const handleToggleCoVanDe = (maChiTietDatSan: string, checked: boolean) => {
        console.log('maChiTietDatSan', maChiTietDatSan)
        setCoVanDeMutate({
            maChiTietDatSan,
            coVanDe: checked,
        })
    }

    return (
        <div>
            <h2 className={styles.title}>Quản lý khung giờ sân bóng</h2>
            <div className={styles.filter_row}>
                <Input
                    placeholder="Tìm kiếm theo tên, số điện thoại, tên sân..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1)
                    }}
                    className={styles.filter_input}
                />
                <Select
                    value={status}
                    onChange={(val) => {
                        setStatus(val)
                        setCurrentPage(1)
                    }}
                    className={styles.filter_select}
                >
                    {statusOptions.map((opt) => (
                        <Select.Option key={opt.value} value={opt.value}>
                            {opt.label}
                        </Select.Option>
                    ))}
                </Select>
                <DatePicker
                    allowClear
                    placeholder="Chọn ngày"
                    value={date ? dayjs(date) : undefined}
                    onChange={(d) => {
                        setDate(d ? d.format('YYYY-MM-DD') : undefined)
                        setCurrentPage(1)
                    }}
                    className={styles.filter_datepicker}
                />
            </div>
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Khách hàng</th>
                            <th>Số điện thoại</th>
                            <th>Sân</th>
                            <th>Ngày</th>
                            <th>Giờ</th>
                            <th>Trạng thái</th>
                            <th>Có vấn đề</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className={styles.no_data}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : slots.length > 0 ? (
                            slots.map((slot) => (
                                <tr key={slot.maChiTietDatSan}>
                                    <td>{slot.nguoiThue?.hoTen || ''}</td>
                                    <td>{slot.nguoiThue?.soDienThoai || ''}</td>
                                    <td>
                                        {slot.maSanChiTiet?.maSanBong?.tenSan ||
                                            ''}
                                    </td>
                                    <td>
                                        {slot.maDatSan?.ngayDat
                                            ? new Date(
                                                  slot.maDatSan.ngayDat
                                              ).toLocaleDateString('vi-VN')
                                            : ''}
                                    </td>
                                    <td>
                                        {slot.gioBatDau} - {slot.gioKetThuc}
                                    </td>
                                    <td>
                                        <span
                                            className={`${styles.status_badge} ${getStatusClass(
                                                slot.trangThaiDatSan
                                            )}`}
                                        >
                                            {getStatusText(
                                                slot.trangThaiDatSan
                                            )}
                                        </span>
                                    </td>
                                    <td>
                                        <Switch
                                            checked={slot.coVanDe}
                                            onChange={(checked) =>
                                                handleToggleCoVanDe(
                                                    slot.maChiTietDatSan,
                                                    checked
                                                )
                                            }
                                            disabled={isSetCoVanDePending}
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className={styles.no_data}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={styles.pagination_wrapper}>
                <Pagination
                    current={currentPage}
                    pageSize={itemsPerPage}
                    total={total}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    size="small"
                />
            </div>
        </div>
    )
}

export default AdminManageTimeSlots
