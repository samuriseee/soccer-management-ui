/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './OwnerFieldCard.module.scss'
// import Image from 'next/image'
import { Edit, Trash2 } from 'lucide-react'
import { Image } from 'antd'
import CustomImage from '@/components/ui/CustomImage/CustomImage'

interface OwnerFieldCardProps {
    maSanChiTiet: string
    tenSanChiTiet: string
    tenLoaiSan: string
    giaThueBuoiSang: number
    giaThueBuoiToi: number
    hinhAnh: any
    onEdit: () => void
    onDelete: () => void
}

const OwnerFieldCard = ({
    maSanChiTiet,
    tenSanChiTiet,
    tenLoaiSan,
    giaThueBuoiSang,
    giaThueBuoiToi,
    hinhAnh,
    onEdit,
    onDelete,
}: OwnerFieldCardProps) => {
    return (
        <div className={styles.field_card}>
            <div className={styles.field_image}>
                {/* <Image
                    src={hinhAnh.link}
                    alt={tenSanChiTiet}
                    className={styles.image}
                    preview={false}
                /> */}
                <CustomImage
                    src={hinhAnh.link}
                    alt={tenSanChiTiet}
                    preview={false}
                />
                <span className={styles.type_badge}>{tenLoaiSan}</span>
            </div>
            <div className={styles.field_details}>
                <h3 className={styles.field_name}>{tenSanChiTiet}</h3>
                <div className={styles.field_info}>
                    <div className={styles.info_item}>
                        <span className={styles.info_label}>Loại sân:</span>
                        <span className={styles.info_value}>{tenLoaiSan}</span>
                    </div>
                    <div className={styles.info_item}>
                        <span className={styles.info_label}>Giá ban ngày:</span>
                        <span className={styles.info_value}>
                            {Number(giaThueBuoiSang).toLocaleString('vi-VN')}{' '}
                            đ/giờ
                        </span>
                    </div>
                    <div className={styles.info_item}>
                        <span className={styles.info_label}>Giá buổi tối:</span>
                        <span className={styles.info_value}>
                            {Number(giaThueBuoiToi).toLocaleString('vi-VN')}{' '}
                            đ/giờ
                        </span>
                    </div>
                </div>
            </div>
            <div className={styles.field_actions}>
                <button
                    className={`${styles.action_button} ${styles.edit}`}
                    onClick={onEdit}
                >
                    <Edit size={16} />
                    <span>Sửa</span>
                </button>
                <button
                    className={`${styles.action_button} ${styles.delete}`}
                    onClick={onDelete}
                >
                    <Trash2 size={16} />
                    <span>Xóa</span>
                </button>
            </div>
        </div>
    )
}

export default OwnerFieldCard
