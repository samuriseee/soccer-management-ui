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
    Search,
    Filter,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Plus,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import styles from './BookingContent.module.scss'
import Button from '@/components/ui/Button/Button'
import Select from '@/components/ui/Select/Select'
import Input from '@/components/ui/TextField/TextField'
import BookingCalendarView from './BookingCalendarView/BookingCalendarView'
import BookingDetailModal from './BookingDetailModal/BookingDetailModal'
import Pagination from '@/components/ui/Pagination/Pagination'
import { useDebounce } from '@/hooks/useDebounce'
import DatePicker from '@/components/ui/DatePicker/DatePicker'
import dayjs from 'dayjs'

interface BookingItem {
    maChiTietDatSan: string
    gioBatDau: string
    gioKetThuc: string
    coVanDe: boolean
    trangThaiDatSan: string
    soTien: string
    maSanChiTiet: {
        tenSanChiTiet: string
    }
    maDatSan: {
        ngayDat: string
        soTien: string
    }
    nguoiThue: {
        hoTen: string
        soDienThoai: string
    }
}

const BookingContent = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
    const [selectedBooking, setSelectedBooking] = useState<any>(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [dateFilter, setDateFilter] = useState<string | undefined>(undefined)
    const itemsPerPage = 12

    // Debounce searchTerm
    const debounceSearchFn = useDebounce((value: string) => {
        setDebouncedSearch(value)
        setCurrentPage(1)
    }, 400)

    // Gọi API lấy danh sách slot theo chủ sân
    const { data, isLoading } = useQuery({
        queryKey: [
            'chu-san-slots',
            debouncedSearch,
            statusFilter,
            currentPage,
            itemsPerPage,
            dateFilter,
        ],
        queryFn: () =>
            timeSlotsService.getSlotsByChuSan({
                page: currentPage,
                limit: itemsPerPage,
                search: debouncedSearch || undefined,
                trangThaiDatSan: statusFilter !== 'all' ? statusFilter : undefined,
                ngayDat: dateFilter,
            }),
    })

    // Chuẩn hóa dữ liệu trả về
    const bookings: BookingItem[] = Array.isArray(data?.data) ? data.data : []
    const total = data?.total || 0

    const paginatedBookings = bookings

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

    const handleViewBookingDetail = (booking: any) => {
        setSelectedBooking(booking)
        setIsDetailModalOpen(true)
    }

    const handleStatusChange = (id: string, newStatus: string) => {
        setIsDetailModalOpen(false)
    }

    const toggleViewMode = () => {
        setViewMode(viewMode === 'list' ? 'calendar' : 'list')
    }

    return (
        <div className={styles.booking_content}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý đặt sân</h1>
                <div className={styles.actions}>
                    <Button
                        type="primary"
                        shape="square"
                        className={styles.calendar_button}
                        onClick={toggleViewMode}
                    >
                        <Calendar size={16} />
                        <span>
                            {viewMode === 'list'
                                ? 'Lịch đặt sân'
                                : 'Danh sách đặt sân'}
                        </span>
                    </Button>
                    {/* <Button
                        type="primary"
                        shape="square"
                        className={styles.create_button}
                    >
                        <Plus size={16} />
                        <span>Nhập đơn đặt sân online</span>
                    </Button> */}
                </div>
            </div>

            {viewMode === 'list' ? (
                <>
                    <div className={styles.filters}>
                        <div className={styles.search_container}>
                            <Input
                                placeholder="Tìm kiếm theo tên, số điện thoại, tên sân chi tiết..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    debounceSearchFn(e.target.value)
                                }}
                                prefix={
                                    <Search
                                        size={18}
                                        className={styles.search_icon}
                                    />
                                }
                                className={styles.search_input}
                            />
                        </div>
                        <div className={styles.filter_container}>
                            <Select
                                value={statusFilter}
                                onChange={(value) => setStatusFilter(value)}
                                className={styles.filter_select}
                                prefix={<Filter size={18} />}
                            >
                                <Select.Option value="all">
                                    Tất cả trạng thái
                                </Select.Option>
                                <Select.Option value="DA_DAT">
                                    Đã xác nhận
                                </Select.Option>
                                <Select.Option value="DA_HUY">
                                    Đã hủy
                                </Select.Option>
                                <Select.Option value="DA_HOAN_THANH">
                                    Hoàn thành
                                </Select.Option>
                                <Select.Option value="CO_VAN_DE">
                                    Có vấn đề
                                </Select.Option>
                            </Select>
                        </div>
                        <div className={styles.filter_container}>
                            <DatePicker
                                allowClear
                                placeholder="Chọn ngày"
                                value={
                                    dateFilter ? dayjs(dateFilter) : undefined
                                }
                                onChange={(date) => {
                                    setDateFilter(
                                        date
                                            ? date.format('YYYY-MM-DD')
                                            : undefined
                                    )
                                    setCurrentPage(1)
                                }}
                                className={styles.filter_datepicker}
                            />
                        </div>
                    </div>

                    <div className={styles.table_container}>
                        <table className={styles.booking_table}>
                            <thead>
                                <tr>
                                    <th>Khách hàng</th>
                                    <th>Số điện thoại</th>
                                    <th>Sân</th>
                                    <th>Ngày</th>
                                    <th>Giờ</th>
                                    <th>Trạng thái</th>
                                    <th>Giá tiền</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className={styles.no_data}
                                        >
                                            Đang tải dữ liệu...
                                        </td>
                                    </tr>
                                ) : paginatedBookings.length > 0 ? (
                                    paginatedBookings.map(
                                        (booking: BookingItem) => (
                                            <tr key={booking.maChiTietDatSan}>
                                                <td>
                                                    {booking.nguoiThue?.hoTen ||
                                                        ''}
                                                </td>
                                                <td>
                                                    {booking.nguoiThue
                                                        ?.soDienThoai || ''}
                                                </td>
                                                <td>
                                                    {booking.maSanChiTiet
                                                        ?.tenSanChiTiet || ''}
                                                </td>
                                                <td>
                                                    {booking.maDatSan?.ngayDat
                                                        ? new Date(
                                                              booking.maDatSan.ngayDat
                                                          ).toLocaleDateString(
                                                              'vi-VN'
                                                          )
                                                        : ''}
                                                </td>
                                                <td>
                                                    {booking.gioBatDau} -{' '}
                                                    {booking.gioKetThuc}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`${styles.status_badge} ${getStatusClass(
                                                            booking.trangThaiDatSan
                                                        )}`}
                                                    >
                                                        {getStatusText(
                                                            booking.trangThaiDatSan
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    {Number(
                                                        booking.soTien || 0
                                                    ).toLocaleString(
                                                        'vi-VN'
                                                    )}{' '}
                                                    đ
                                                </td>
                                                <td>
                                                    <div
                                                        className={
                                                            styles.actions_cell
                                                        }
                                                    >
                                                        <Button
                                                            type="default"
                                                            size="small"
                                                            className={
                                                                styles.detail_button
                                                            }
                                                            onClick={() =>
                                                                handleViewBookingDetail(
                                                                    booking
                                                                )
                                                            }
                                                        >
                                                            Chi tiết
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className={styles.no_data}
                                        >
                                            Không có dữ liệu đặt sân
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
                </>
            ) : (
                // <BookingCalendarView
                //     bookings={bookings}
                //     onViewDetail={handleViewBookingDetail}
                // />
                <div></div>
            )}

            <BookingDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                bookingData={selectedBooking}
                onStatusChange={handleStatusChange}
            />
        </div>
    )
}

export default BookingContent
