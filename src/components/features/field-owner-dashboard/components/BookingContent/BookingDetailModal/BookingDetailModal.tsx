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
import { Modal } from 'antd'
import {
    Calendar,
    Clock,
    User,
    Phone,
    MapPin,
    CreditCard,
    FileText,
    CheckCircle,
    XCircle,
} from 'lucide-react'
import styles from './BookingDetailModal.module.scss'
import Button from '@/components/ui/Button/Button'
import ModalConfirm from '@/components/features/home/ModalConfirm'

interface BookingDetailModalProps {
    isOpen: boolean
    onClose: () => void
    bookingData: any
    onStatusChange?: (id: string, newStatus: string) => void
}

const BookingDetailModal = ({
    isOpen,
    onClose,
    bookingData,
    onStatusChange,
}: BookingDetailModalProps) => {
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(
        null
    )

    if (!bookingData) return null

    // Lấy thông tin từ API trả về
    const {
        maChiTietDatSan,
        gioBatDau,
        gioKetThuc,
        trangThaiDatSan,
        soTien,
        maSanChiTiet,
        maDatSan,
        nguoiThue,
        coVanDe,
        // ...other fields
    } = bookingData

    const hoTen = nguoiThue?.hoTen || ''
    const soDienThoai = nguoiThue?.soDienThoai || ''
    const tenSanChiTiet = maSanChiTiet?.tenSanChiTiet || ''
    const ngayDat = maDatSan?.ngayDat || ''
    const giaThue = Number(soTien || 0)

    const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(date)
    }

    const khungGio = `${gioBatDau} - ${gioKetThuc}`

    const getStatusText = (status: string) => {
        switch (status) {
            case 'DA_DAT':
                return 'Đã xác nhận'
            case 'DA_HUY':
                return 'Đã hủy'
            case 'DA_HOAN_THANH':
                return 'Hoàn thành'
            default:
                return status
        }
    }

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'DA_DAT':
                return styles.status_confirmed
            case 'DA_HUY':
                return styles.status_cancelled
            case 'DA_HOAN_THANH':
                return styles.status_done
            default:
                return ''
        }
    }

    const handleConfirmAction = () => {
        if (actionType && onStatusChange) {
            const newStatus =
                actionType === 'confirm'
                    ? 'DA_DAT'
                    : actionType === 'cancel'
                    ? 'DA_HUY'
                    : ''
            if (newStatus) {
                onStatusChange(maChiTietDatSan, newStatus)
            }
        }
        setIsConfirmModalOpen(false)
    }

    const openConfirmModal = (type: 'confirm' | 'cancel') => {
        setActionType(type)
        setIsConfirmModalOpen(true)
    }

    return (
        <>
            <Modal
                title="Chi tiết đặt sân"
                open={isOpen}
                onCancel={onClose}
                footer={null}
                width={700}
                className={styles.booking_detail_modal}
            >
                <div className={styles.booking_detail_content}>
                    <div className={styles.booking_header}>
                        <div className={styles.booking_id}>
                            <span className={styles.label}>Mã đặt sân:</span>
                            <span className={styles.value}>
                                {maChiTietDatSan}
                            </span>
                        </div>
                        <div className={styles.booking_status}>
                            <span
                                className={`${styles.status_badge} ${getStatusClass(trangThaiDatSan)}`}
                            >
                                {getStatusText(trangThaiDatSan)}
                            </span>
                        </div>
                    </div>

                    <div className={styles.booking_sections}>
                        <div className={styles.booking_section}>
                            <h3 className={styles.section_title}>
                                Thông tin khách hàng
                            </h3>
                            <div className={styles.info_grid}>
                                <div className={styles.info_item}>
                                    <User
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Họ tên:
                                    </span>
                                    <span className={styles.info_value}>
                                        {hoTen}
                                    </span>
                                </div>
                                <div className={styles.info_item}>
                                    <Phone
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Số điện thoại:
                                    </span>
                                    <span className={styles.info_value}>
                                        {soDienThoai}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.booking_section}>
                            <h3 className={styles.section_title}>
                                Thông tin đặt sân
                            </h3>
                            <div className={styles.info_grid}>
                                <div className={styles.info_item}>
                                    <MapPin
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Sân:
                                    </span>
                                    <span className={styles.info_value}>
                                        {tenSanChiTiet}
                                    </span>
                                </div>
                                <div className={styles.info_item}>
                                    <Calendar
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Ngày:
                                    </span>
                                    <span className={styles.info_value}>
                                        {formatDate(ngayDat)}
                                    </span>
                                </div>
                                <div className={styles.info_item}>
                                    <Clock
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Giờ:
                                    </span>
                                    <span className={styles.info_value}>
                                        {khungGio}
                                    </span>
                                </div>
                                <div className={styles.info_item}>
                                    <CreditCard
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <span className={styles.info_label}>
                                        Giá tiền:
                                    </span>
                                    <span className={styles.info_value}>
                                        {giaThue.toLocaleString('vi-VN')} đ
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Nếu có ghi chú hoặc vấn đề */}
                        {(bookingData.ghiChu || coVanDe) && (
                            <div className={styles.booking_section}>
                                <h3 className={styles.section_title}>
                                    Ghi chú
                                </h3>
                                <div className={styles.note_container}>
                                    <FileText
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    <p className={styles.note_text}>
                                        {bookingData.ghiChu ||
                                            (coVanDe
                                                ? 'Có vấn đề với đơn đặt sân này'
                                                : '')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.booking_actions}>
                        {trangThaiDatSan === 'pending' && (
                            <>
                                <Button
                                    type="default"
                                    shape="square"
                                    className={styles.cancel_button}
                                    onClick={() => openConfirmModal('cancel')}
                                >
                                    <XCircle size={16} />
                                    <span>Từ chối</span>
                                </Button>
                                <Button
                                    type="primary"
                                    shape="square"
                                    className={styles.confirm_button}
                                    onClick={() => openConfirmModal('confirm')}
                                >
                                    <CheckCircle size={16} />
                                    <span>Xác nhận</span>
                                </Button>
                            </>
                        )}
                        {/* {trangThaiDatSan === 'DA_DAT' && (
                            <Button
                                type="default"
                                shape="square"
                                className={styles.cancel_button}
                                onClick={() => openConfirmModal('cancel')}
                            >
                                <XCircle size={16} />
                                <span>Hủy đặt sân</span>
                            </Button>
                        )} */}
                    </div>
                </div>
            </Modal>

            <ModalConfirm
                open={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onClickConfirm={handleConfirmAction}
                title={
                    actionType === 'confirm'
                        ? 'Xác nhận đơn đặt sân'
                        : actionType === 'cancel'
                          ? 'Hủy đơn đặt sân'
                          : 'Xác nhận thao tác'
                }
                description={
                    actionType === 'confirm'
                        ? 'Bạn có chắc chắn muốn xác nhận đơn đặt sân này không?'
                        : actionType === 'cancel'
                          ? 'Bạn có chắc chắn muốn hủy đơn đặt sân này không? Hành động này không thể hoàn tác.'
                          : 'Bạn có chắc chắn muốn thực hiện thao tác này không?'
                }
            />
        </>
    )
}

export default BookingDetailModal
