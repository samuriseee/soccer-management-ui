/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
// LocationSelector.tsx

'use client'

import { useEffect, useState } from 'react'
import { Form } from 'antd'
import { danangAddress } from '@/data/danangAddress'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Select from '@/components/ui/Select/Select'
import styles from './LocationSelector.module.scss'
import HintText from '@/components/ui/HintText/HintText'

// Định nghĩa interface cho dữ liệu
interface Ward {
    Id?: string
    Name?: string
    Level: string
}

interface District {
    Id: string
    Name: string
    Wards: Ward[]
}

interface Province {
    Id: string
    Name: string
    Districts: District[]
}

interface SelectOption {
    label: string
    value: string
    code?: string
}

interface LocationSelectorProps {
    onLocationSelect?: (location: {
        thanhPho: string
        quanHuyen: string
        phuongXa: string
        diaChi: string
    }) => void
}

const LocationSelector = ({ onLocationSelect }: LocationSelectorProps) => {
    const [districts, setDistricts] = useState<SelectOption[]>([])
    const [wards, setWards] = useState<SelectOption[]>([])
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<
        string | undefined
    >(undefined)

    // Lấy giá trị hiện tại từ form
    const quanHuyen = Form.useWatch('quanHuyen') || ''
    const phuongXa = Form.useWatch('phuongXa') || ''
    const diaChi = Form.useWatch('diaChi') || ''

    // Khởi tạo danh sách quận/huyện
    useEffect(() => {
        const daNang = danangAddress[0] // Chỉ có Đà Nẵng
        if (daNang) {
            const districtOptions = daNang.Districts.filter(
                (district: District) => district.Wards[0]?.Level !== 'Huyện' // Loại bỏ Huyện Hoàng Sa
            ).map((district: District) => ({
                label: district.Name,
                value: district.Name,
                code: district.Id,
            }))
            setDistricts(districtOptions)

            // Nếu có giá trị quanHuyen, tải danh sách phường/xã
            if (quanHuyen) {
                const districtData = daNang.Districts.find(
                    (d: District) => d.Name === quanHuyen
                )
                if (districtData) {
                    setSelectedDistrictCode(districtData.Id)
                    const wardOptions = districtData.Wards.filter(
                        (ward: Ward) => ward.Name
                    ).map((ward: Ward) => ({
                        label: ward.Name!,
                        value: ward.Name!,
                        code: ward.Id,
                    }))
                    setWards(wardOptions)
                }
            }
        }
    }, [quanHuyen])

    // Xử lý khi chọn quận/huyện
    const handleDistrictChange = (value: string, option: any) => {
        setSelectedDistrictCode(option.code)
        setWards([])

        const daNang = danangAddress[0]
        if (daNang) {
            const districtData = daNang.Districts.find(
                (d: District) => d.Id === option.code
            )
            if (districtData) {
                const wardOptions = districtData.Wards.filter(
                    (ward: Ward) => ward.Name
                ).map((ward: Ward) => ({
                    label: ward.Name!,
                    value: ward.Name!,
                    code: ward.Id,
                }))
                setWards(wardOptions)
            }
        }

        // Gọi callback để cập nhật form cha
        if (onLocationSelect) {
            onLocationSelect({
                thanhPho: 'Đà Nẵng', // luôn gửi mặc định
                quanHuyen: value,
                phuongXa: '', // Reset phuongXa khi chọn quận/huyện mới
                diaChi,
            })
        }
    }

    // Xử lý khi chọn phường/xã
    const handleWardChange = (value: string) => {
        if (onLocationSelect) {
            onLocationSelect({
                thanhPho: 'Đà Nẵng', // luôn gửi mặc định
                quanHuyen,
                phuongXa: value || '',
                diaChi,
            })
        }
    }

    return (
        <div className={styles.location_selector}>
            <h2 className={styles.section_title}>Vị trí</h2>

            <div className={styles.form_group}>
                <label htmlFor="quanHuyen" className={styles.form_label}>
                    Quận / Huyện <span className={styles.required}>*</span>
                </label>
                <Form.Item
                    name="quanHuyen"
                    rules={[
                        {
                            required: true,
                            message: (
                                <HintText
                                    size="small"
                                    type="error"
                                    text={'Vui lòng chọn quận/huyện'}
                                />
                            ),
                        },
                    ]}
                >
                    <Select
                        placeholder="Chọn quận/huyện"
                        options={districts}
                        onChange={handleDistrictChange}
                        className={styles.form_select}
                    />
                </Form.Item>
            </div>

            <div className={styles.form_group}>
                <label htmlFor="phuongXa" className={styles.form_label}>
                    Phường / Xã
                </label>
                <Form.Item name="phuongXa">
                    <Select
                        placeholder="Chọn phường/xã (không bắt buộc)"
                        options={wards}
                        onChange={handleWardChange}
                        disabled={!selectedDistrictCode}
                        // allowClear
                        className={styles.form_select}
                    />
                </Form.Item>
                <p className={styles.helper_text}>
                    Bạn có thể bỏ qua nếu không cần chi tiết phường/xã
                </p>
            </div>

            <div className={styles.form_group}>
                <label htmlFor="diaChi" className={styles.form_label}>
                    Địa chỉ chi tiết <span className={styles.required}>*</span>
                </label>
                <InputFormItem
                    name="diaChi"
                    type="default"
                    requiredMessage="Địa chỉ không được để trống!"
                    required
                    placeholder="Nhập địa chỉ sân bóng"
                    classNameInput={styles.form_input}
                />
                <p className={styles.helper_text}>
                    Nhập số nhà, tên đường để xác định vị trí chính xác
                </p>
            </div>
            {diaChi && quanHuyen && (
                <div className={styles.location_info}>
                    <h3 className={styles.location_title}>Vị trí đã chọn</h3>
                    <p className={styles.location_address}>
                        🏠{' '}
                        {`${diaChi}, ${phuongXa ? phuongXa + ', ' : ''}${quanHuyen}, Đà Nẵng`}
                    </p>
                </div>
            )}
        </div>
    )
}

export default LocationSelector
