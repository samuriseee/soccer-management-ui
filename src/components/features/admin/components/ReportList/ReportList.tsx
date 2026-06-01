/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportService } from '@/core/services/API/Report/Report.service'
import styles from './ReportList.module.scss'
import Pagination from '@/components/ui/Pagination/Pagination'
import Input from '@/components/ui/TextField/TextField'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import dayjs from 'dayjs'
import { useDebounce } from '@/hooks/useDebounce'

const PAGE_SIZE = 12

const ReportList = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [fromDate, setFromDate] = useState<string | undefined>(undefined)
    const [toDate, setToDate] = useState<string | undefined>(undefined)
    const debounceSearchFn = useDebounce((value: string) => {
        setDebouncedSearch(value)
    }, 400)

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, fromDate, toDate])

    const { data, isLoading } = useQuery({
        queryKey: ['danh-sach-bao-cao-admin', currentPage, debouncedSearch, fromDate, toDate],
        queryFn: () =>
            reportService.getAllReports({
                page: currentPage,
                limit: PAGE_SIZE,
                search: debouncedSearch || undefined,
                fromDate,
                toDate,
            }),
    })

    const reports = data?.data || []
    const total = data?.total || 0

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Danh sách báo cáo</h2>
            <div className={styles.filter_row}>
                <Input
                    name="search"
                    placeholder="Tìm kiếm theo tên sân, tên người thuê..."
                    value={search}
                    onChange={e => {
                        setSearch(e.target.value)
                        debounceSearchFn(e.target.value)
                    }}
                    className={styles.filter_input}
                />
                <DatePicker
                    allowClear
                    placeholder="Từ ngày"
                    value={fromDate ? dayjs(fromDate) : undefined}
                    onChange={d => {
                        const newFromDate = d ? d.format('YYYY-MM-DD') : undefined
                        setFromDate(newFromDate)
                        if (toDate && newFromDate && dayjs(newFromDate).isAfter(dayjs(toDate))) {
                            setToDate(newFromDate)
                        }
                    }}
                    className={styles.filter_datepicker}
                />
                <DatePicker
                    allowClear
                    placeholder="Đến ngày"
                    value={toDate ? dayjs(toDate) : undefined}
                    onChange={d => {
                        const newToDate = d ? d.format('YYYY-MM-DD') : undefined
                        setToDate(newToDate)
                    }}
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
                        <th>Người báo cáo</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Tên sân</th>
                        <th>Địa chỉ sân</th>
                        <th>Thời gian báo cáo</th>
                        <th>Lý do</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className={styles.no_data}>
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : reports.length === 0 ? (
                        <tr>
                            <td colSpan={7} className={styles.no_data}>
                                Không có báo cáo nào
                            </td>
                        </tr>
                    ) : (
                        reports.map((item: any) => {
                            const nguoiThue = item.nguoiThue || {}
                            const san = item.maSanBong || {}
                            const diaChi = [
                                san.diaChi,
                                san.phuongXa,
                                san.quanHuyen,
                                san.thanhPho,
                            ]
                                .filter(Boolean)
                                .join(', ')
                            return (
                                <tr key={item.maBaoCao}>
                                    <td>{nguoiThue.hoTen}</td>
                                    <td>{nguoiThue.soDienThoai}</td>
                                    <td>{nguoiThue.email}</td>
                                    <td>{san.tenSan}</td>
                                    <td>{diaChi}</td>
                                    <td>
                                        {dayjs(item.thoiGianBaoCao).format(
                                            'DD/MM/YYYY HH:mm'
                                        )}
                                    </td>
                                    <td>{item.lyDo}</td>
                                </tr>
                            )
                        })
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
    )
}

export default ReportList
