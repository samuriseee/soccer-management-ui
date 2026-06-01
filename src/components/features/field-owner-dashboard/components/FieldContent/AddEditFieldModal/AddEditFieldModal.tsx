/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import { useEffect, useState } from 'react'
import { Form, Modal } from 'antd'
import styles from './AddEditFieldModal.module.scss'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import Select from '@/components/ui/Select/Select'
import Button from '@/components/ui/Button/Button'
import HintText from '@/components/ui/HintText/HintText'
import { showMessage } from '@/components/ui/Notification/Notification'
import { FieldDetailFromApi, FieldFormData, FieldType } from '../types/field'

interface AddEditFieldModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (fieldData: FieldFormData) => void
    fieldData: FieldDetailFromApi | null
    fieldTypes: FieldType[]
    isCreating?: boolean
    isUpdating?: boolean
}

const AddEditFieldModal = ({
    isOpen,
    onClose,
    onSave,
    fieldData,
    fieldTypes,
    isCreating = false,
    isUpdating = false,
}: AddEditFieldModalProps) => {
    const [form] = Form.useForm()
    const isEditing = !!fieldData
    const [imageUrl, setImageUrl] = useState<string>('')
    const [imageError, setImageError] = useState<boolean>(false)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null
    )

    useEffect(() => {
        if (isOpen) {
            if (fieldData) {
                form.setFieldsValue({
                    maLoaiSan: fieldData.maLoaiSan,
                    tenSanChiTiet: fieldData.tenSanChiTiet,
                    giaThueBuoiSang: fieldData.giaThueBuoiSang,
                    giaThueBuoiToi: fieldData.giaThueBuoiToi,
                })
                if (fieldData.media && fieldData.media.length > 0) {
                    setImageUrl(fieldData.media[0].link)
                } else {
                    setImageUrl('')
                }
                setSelectedImageFile(null)
                setImageError(false)
            } else {
                form.resetFields()
                setImageUrl('')
                setSelectedImageFile(null)
                setImageError(false)
            }
        }
    }, [isOpen, fieldData, form])

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            if (!imageUrl && !selectedImageFile) {
                setImageError(true)
                // showMessage('error', 'Vui lòng tải lên hình ảnh sân')
                return
            }

            const fieldToSave: FieldFormData = {
                maSanChiTiet: fieldData?.maSanChiTiet,
                maSanBong: fieldData?.maSanBong || '',
                maLoaiSan: values.maLoaiSan,
                tenSanChiTiet: values.tenSanChiTiet,
                giaThueBuoiSang: values.giaThueBuoiSang,
                giaThueBuoiToi: values.giaThueBuoiToi,
                hinhAnh: selectedImageFile,
            }

            onSave(fieldToSave)
        })
    }

    return (
        <Modal
            title={isEditing ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    maLoaiSan: fieldTypes[0]?.maLoaiSan || '',
                    tenSanChiTiet: '',
                    giaThueBuoiSang: 0,
                    giaThueBuoiToi: 0,
                }}
            >
                <div className={styles.form_group}>
                    <label htmlFor="maLoaiSan" className={styles.form_label}>
                        Loại sân <span className={styles.required}>*</span>
                    </label>
                    <Form.Item
                        name="maLoaiSan"
                        noStyle
                        rules={[
                            {
                                required: true,
                                message: (
                                    <HintText
                                        size="small"
                                        type="error"
                                        text={'Vui lòng chọn loại sân'}
                                    />
                                ),
                            },
                        ]}
                    >
                        <Select
                            className={styles.form_select}
                            placeholder="Chọn loại sân"
                        >
                            {fieldTypes.map((type) => (
                                <Select.Option
                                    key={type.maLoaiSan}
                                    value={type.maLoaiSan}
                                >
                                    {type.tenLoaiSan}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                <div className={styles.form_group}>
                    <label
                        htmlFor="tenSanChiTiet"
                        className={styles.form_label}
                    >
                        Tên sân bóng <span className={styles.required}>*</span>
                    </label>
                    <InputFormItem
                        name="tenSanChiTiet"
                        type="default"
                        requiredMessage="Tên sân chi tiết không được để trống!"
                        required
                        placeholder="Nhập tên sân chi tiết"
                        classNameInput={styles.form_input}
                    />
                </div>

                <div className={styles.form_group}>
                    <label
                        htmlFor="giaThueBuoiSang"
                        className={styles.form_label}
                    >
                        Giá thuê buổi sáng{' '} (tính đến 17h)
                        <span className={styles.required}>*</span>
                    </label>
                    <InputFormItem
                        type="currency"
                        name="giaThueBuoiSang"
                        placeholder="Nhập giá thuê buổi sáng"
                        required
                        classNameInput={styles.form_input}
                    />
                </div>

                <div className={styles.form_group}>
                    <label
                        htmlFor="giaThueBuoiToi"
                        className={styles.form_label}
                    >
                        Giá thuê buổi tối{' '}
                        <span className={styles.required}>*</span>
                    </label>
                    <InputFormItem
                        type="currency"
                        name="giaThueBuoiToi"
                        placeholder="Nhập giá thuê buổi tối"
                        required
                        classNameInput={styles.form_input}
                    />
                </div>

                <div className={styles.form_group}>
                    <label className={styles.form_label}>
                        Hình ảnh sân <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.image_upload_container}>
                        {imageUrl && (
                            <div className={styles.image_preview}>
                                <img src={imageUrl} alt="field preview" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className={styles.file_input}
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                    if (!file.type.startsWith('image/')) {
                                        showMessage(
                                            'error',
                                            'Vui lòng chọn file hình ảnh!'
                                        )
                                        return
                                    }

                                    if (file.size > 5 * 1024 * 1024) {
                                        showMessage(
                                            'error',
                                            'Kích thước file không được vượt quá 5MB!'
                                        )
                                        return
                                    }

                                    const objectUrl = URL.createObjectURL(file)
                                    setImageUrl(objectUrl)
                                    setSelectedImageFile(file)
                                    setImageError(false)
                                }
                            }}
                        />
                    </div>
                    {imageError && (
                        <HintText
                            size="small"
                            type="error"
                            text={'Vui lòng tải lên hình ảnh sân'}
                        />
                    )}
                </div>

                <div className={styles.form_actions}>
                    <Button type="primary" shape="square" htmlType="submit" loading={isCreating || isUpdating}>
                        {isEditing ? 'Cập nhật' : 'Thêm mới'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}

export default AddEditFieldModal
