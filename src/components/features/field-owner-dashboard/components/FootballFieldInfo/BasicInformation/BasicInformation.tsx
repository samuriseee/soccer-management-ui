/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import type React from 'react'
import styles from './BasicInformation.module.scss'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import TextArea from '@/components/ui/Textarea/Textarea'
import { Form } from 'antd'
import HintText from '@/components/ui/HintText/HintText'

const BasicInformation = () => {
    return (
        <div className={styles.basic_infor_mation}>
            <h2 className={styles.section_title}>Thông tin cơ bản</h2>

            <div className={styles.form_group}>
                <label htmlFor="tenSan" className={styles.form_label}>
                    Tên sân bóng <span className={styles.required}>*</span>
                </label>
                <InputFormItem
                    name="tenSan"
                    type="default"
                    requiredMessage="Tên sân bóng không được để trống!"
                    required
                    placeholder="Nhập tên sân bóng"
                    classNameInput={styles.form_input}
                    // classNameFormItem={styles.form_group}
                />
            </div>

            <div className={styles.form_group}>
                <label htmlFor="moTa" className={styles.form_label}>
                    Mô tả <span className={styles.required}>*</span>
                </label>
                <Form.Item
                    name="moTa"
                    rules={[
                        {
                            required: true,
                            message: (
                                <HintText
                                    size="small"
                                    type="error"
                                    text={'Mô tả không được để trống!'}
                                />
                            ),
                        },
                    ]}
                >
                    <TextArea
                        className={styles.form_textarea}
                        placeholder="Mô tả chi tiết về sân bóng của bạn (cơ sở vật chất, dịch vụ đi kèm, v.v.)"
                        rows={6}
                    />
                </Form.Item>
                <p className={styles.helper_text}>
                    Mô tả chi tiết sẽ giúp người thuê hiểu rõ hơn về sân bóng
                    của bạn
                </p>
            </div>

            {/* <div className={styles.form_group}>
                <label htmlFor="diaChi" className={styles.form_label}>
                    Địa chỉ <span className={styles.required}>*</span>
                </label>
                <InputFormItem
                    name="diaChi"
                    type="default"
                    requiredMessage="Địa chỉ không được để trống!"
                    required
                    placeholder="Nhập địa chỉ sân bóng"
                    classNameInput={styles.form_input}
                    // classNameFormItem={styles.form_group}
                />
                <p className={styles.helper_text}>
                    Bạn có thể chọn vị trí chính xác trên bản đồ ở tab "Vị trí"
                </p>
            </div> */}
        </div>
    )
}

export default BasicInformation
