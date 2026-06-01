import React from 'react'
import { Modal } from 'antd'
import dayjs from 'dayjs'
import styles from './BookingDetailModal.module.scss'

interface BookingDetailModalProps {
    open: boolean
    onClose: () => void
    booking: any
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
    open,
    onClose,
    booking,
}) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Chi tiết các slot đã đặt"
            width={600}
            className={styles.modal}
        >
            {booking && (
                <table className={styles.detail_table}>
                    <thead>
                        <tr>
                            <th>Tên sân chi tiết</th>
                            <th>Giờ bắt đầu</th>
                            <th>Giờ kết thúc</th>
                            <th>Ngày đá bóng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.chiTiet?.map((slot: any) => (
                            <tr key={slot.maChiTietDatSan || slot._id}>
                                <td>{slot.maSanChiTiet?.tenSanChiTiet || slot.tenSanChiTiet || ''}</td>
                                <td>{slot.gioBatDau}</td>
                                <td>{slot.gioKetThuc}</td>
                                <td>
                                    {booking.datSan?.ngayDat
                                        ? dayjs(booking.datSan.ngayDat).format('DD/MM/YYYY')
                                        : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </Modal>
    )
}

export default BookingDetailModal
