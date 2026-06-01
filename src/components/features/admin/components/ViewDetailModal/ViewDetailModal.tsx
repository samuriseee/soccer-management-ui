/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Modal, Descriptions } from 'antd'
import styles from './ViewDetailModal.module.scss'

interface ViewDetailModalProps {
    open: boolean
    onClose: () => void
    sanBong: any
}

const ViewDetailModal: React.FC<ViewDetailModalProps> = ({
    open,
    onClose,
    sanBong,
}) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            title="Chi tiết sân bóng"
            width={500}
        >
            {sanBong && (
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Tên sân">
                        {sanBong.tenSan}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chủ sân">
                        {sanBong.chuSanHoTen}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                        {sanBong.chuSanEmail}
                    </Descriptions.Item>
                    <Descriptions.Item label="SĐT">
                        {sanBong.chuSanSoDienThoai}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">
                        {[
                            sanBong.diaChi,
                            sanBong.phuongXa,
                            sanBong.quanHuyen,
                            sanBong.thanhPho,
                        ]
                            .filter(
                                (item) =>
                                    typeof item === 'string' &&
                                    !!item &&
                                    item.trim() !== '' &&
                                    item !== 'undefined'
                            )
                            .join(', ')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giờ hoạt động">
                        {sanBong.gioMoCua} - {sanBong.gioDongCua}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <span
                            className={
                                sanBong.daDuyet
                                    ? styles.status_approved
                                    : styles.status_pending
                            }
                        >
                            {sanBong.daDuyet ? 'Đã duyệt' : 'Chưa duyệt'}
                        </span>
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    )
}

export default ViewDetailModal
