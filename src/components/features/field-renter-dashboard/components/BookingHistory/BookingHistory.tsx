/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import { useAuth } from '@/contexts/auth/AuthContext'
import dayjs from 'dayjs'
import Pagination from '@/components/ui/Pagination/Pagination'
import styles from './BookingHistory.tsx.module.scss'
import BookingDetailModal from '../BookingDetailModal/BookingDetailModal'
import Button from '@/components/ui/Button/Button'
import ModalConfirm from '@/components/features/home/ModalConfirm'
import { showMessage } from '@/components/ui/Notification/Notification'
import Alert from '@/components/ui/Alert/Alert'
import Loading from '@/app/[locale]/loading'

const PAGE_SIZE = 12

const BookingHistory = () => {
    const { user } = useAuth()
    const [currentPage, setCurrentPage] = useState(1)
    const [detailOpen, setDetailOpen] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<any>(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [bookingToCancel, setBookingToCancel] = useState<any>(null)
    const queryClient = useQueryClient()

    const { data, isLoading, refetch } = useQuery({
        queryKey: [
            'booking-history',
            user?.maNguoiDung,
            currentPage,
            PAGE_SIZE,
        ],
        queryFn: () =>
            timeSlotsService.getAllLichSuDatSanNguoiThue({
                page: currentPage,
                limit: PAGE_SIZE,
            }),
        enabled: !!user?.maNguoiDung,
    })

    const {mutate: cancelMutation, isPending} = useMutation({
        mutationFn: (maDatSan: string) =>
            timeSlotsService.cancelDatSan({ maDatSan }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['booking-history'] })
            queryClient.invalidateQueries({ queryKey: ['getInformationUser'] })
            refetch()
            showMessage('success', 'Hủy đặt sân thành công!')
            // window.location.reload()
            setTimeout(() => {
                window.location.reload()
            }, 800)
        },
        onError: (error: any) => {
            const errorMessage =
                error?.response?.data?.message || 'Hủy đặt sân thất bại!'
            showMessage('error', errorMessage)
        },
    })

    const handleCancelBooking = (booking: any) => {
        setBookingToCancel(booking)
        setShowConfirmModal(true)
    }

    const handleConfirmCancel = () => {
        if (!bookingToCancel) return
        const maDatSan =
            bookingToCancel.datSan?.maDatSan || bookingToCancel.maDatSan
        if (!maDatSan) return
        cancelMutation(maDatSan)
        setShowConfirmModal(false)
        setBookingToCancel(null)
    }

    const handleCancelConfirm = () => {
        setShowConfirmModal(false)
        setBookingToCancel(null)
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DA_DAT':
                return styles.status_success
            case 'DA_HUY':
                return styles.status_cancel
            case 'DA_HOAN_THANH':
                return styles.status_done
            case 'CO_VAN_DE':
                return styles.status_problem
            default:
                return ''
        }
    }

    // Chuẩn hóa dữ liệu trả về
    const bookings = Array.isArray(data) ? data : data?.data || []
    const total = data?.total || 0

    // Lấy trạng thái đặt sân từ slot đầu tiên (nếu có)
    const getTrangThai = (booking: any) => {
        const slot = booking.chiTiet?.[0]
        if (!slot) return 'Không rõ'
        return (
            <span className={getStatusClass(slot.trangThaiDatSan)}>
                {slot.trangThaiDatSan === 'DA_DAT'
                    ? 'Đã đặt'
                    : slot.trangThaiDatSan === 'DA_HUY'
                      ? 'Đã hủy'
                      : slot.trangThaiDatSan === 'DA_HOAN_THANH'
                        ? 'Hoàn thành'
                        : slot.trangThaiDatSan === 'CO_VAN_DE'
                          ? 'Có vấn đề'
                          : slot.trangThaiDatSan}
            </span>
        )
    }

    // Gộp địa chỉ
    const getDiaChi = (slot: any) => {
        if (!slot) return ''
        const { diaChi, phuongXa, quanHuyen, thanhPho } = slot
        return [diaChi, phuongXa, quanHuyen, thanhPho]
            .filter((x) => !!x && x !== 'undefined')
            .join(', ')
    }

    // Xem chi tiết
    const handleViewDetail = (booking: any) => {
        setSelectedBooking(booking)
        setDetailOpen(true)
    }

    return (
        <div className={styles.booking_history_wrapper}>
            {isPending && <Loading />}
            <h2 className={styles.title}>Lịch sử đặt sân</h2>
            <Alert
                type="info"
                message="Các slot thuộc gói đặt tháng không thể hủy. Nếu cần hỗ trợ, vui lòng liên hệ quản trị viên."
                showIcon
                className={styles.monthly_alert}
            />
            <div className={styles.table_scroll_wrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Ngày đá bóng</th>
                            <th>Số tiền</th>
                            <th>Tên sân</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className={styles.no_data}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : bookings.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.no_data}>
                                    Chưa có lịch sử đặt sân
                                </td>
                            </tr>
                        ) : (
                            bookings.map((item: any) => {
                                const maDatSan =
                                    item.datSan?.maDatSan ||
                                    item.maDatSan ||
                                    item._id
                                const slot = item.chiTiet?.[0]
                                const isMonthlyBooking = slot?.maLoaiDat?.code === 'MONTHLY'
                                const isCancelDisabled =
                                    slot?.trangThaiDatSan === 'DA_HUY' ||
                                    slot?.trangThaiDatSan === 'DA_HOAN_THANH' ||
                                    slot?.trangThaiDatSan === 'CO_VAN_DE' ||
                                    isMonthlyBooking
                                return (
                                    <tr key={maDatSan}>
                                        <td>
                                            {item.datSan?.ngayDat
                                                ? dayjs(
                                                      item.datSan.ngayDat
                                                  ).format('DD/MM/YYYY')
                                                : ''}
                                        </td>
                                        <td>
                                            {item.datSan?.soTien
                                                ? Number(
                                                      item.datSan.soTien
                                                  ).toLocaleString('vi-VN') +
                                                  ' đ'
                                                : ''}
                                        </td>
                                        <td>
                                            {item.chiTiet?.[0]?.tenSan || ''}
                                        </td>
                                        <td>{getDiaChi(item.chiTiet?.[0])}</td>
                                        <td>{getTrangThai(item)}</td>
                                        <td>
                                            <div className={styles.action_btns}>
                                                <Button
                                                    type="default"
                                                    size="small"
                                                    className={styles.detail_btn}
                                                    onClick={() =>
                                                        handleViewDetail(item)
                                                    }
                                                >
                                                    Xem chi tiết
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            item
                                                        )
                                                    }
                                                    disabled={isCancelDisabled}
                                                    className={styles.cancel_btn}
                                                >
                                                    Hủy đặt sân
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
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
            <BookingDetailModal
                open={detailOpen}
                onClose={() => setDetailOpen(false)}
                booking={selectedBooking}
            />
            <ModalConfirm
                open={showConfirmModal}
                onCancel={handleCancelConfirm}
                onClickConfirm={handleConfirmCancel}
                title="Xác nhận hủy đặt sân"
                description="Bạn có chắc chắn muốn hủy đơn đặt sân này không?"
            />
        </div>
    )
}

export default BookingHistory
