/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import styles from './ChangePassword.module.scss'
import { Form } from 'antd'
import InputFormItem from '@/components/ui/InputFormItem/InputFormItem'
import InputPassword from '@/components/ui/InputPassword/InputPassword'
import Button from '@/components/ui/Button/Button'
import HintText from '@/components/ui/HintText/HintText'
import { ValidateService } from '@/core/services/Validate.service'

const ChangePassword = () => {
    const [form] = Form.useForm()

    const handleSubmit = (values: any) => {
        const { matKhau, matKhauMoi, matKhauNhapLai } = values

        console.log('Đổi mật khẩu với:', {
            matKhau,
            matKhauMoi,
            matKhauNhapLai,
        })

        form.resetFields()
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.card_header}>
                    <h1 className={styles.card_title}>Đổi mật khẩu</h1>
                    <p className={styles.card_description}>
                        Cập nhật mật khẩu tài khoản của bạn
                    </p>
                </div>

                <div className={styles.card_content}>
                    <Form
                        form={form}
                        onFinish={handleSubmit}
                        layout="vertical"
                        className={styles.form_grid}
                    >
                        <div className={styles.form_group}>
                            <label htmlFor="matKhau" className={styles.label}>
                                Mật khẩu hiện tại{' '}
                                <span className={styles.required}>*</span>
                            </label>
                            <InputFormItem
                                name="matKhau"
                                placeholder="Nhập mật khẩu hiện tại"
                                type="password"
                                required
                                requiredMessage="Vui lòng nhập mật khẩu hiện tại"
                                classNameInput={styles.input}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label
                                htmlFor="matKhauMoi"
                                className={styles.label}
                            >
                                Mật khẩu mới{' '}
                                <span className={styles.required}>*</span>
                            </label>
                            <InputFormItem
                                name="matKhauMoi"
                                placeholder="Nhập mật khẩu mới"
                                type="password"
                                required
                                requiredMessage="Vui lòng nhập mật khẩu mới"
                                classNameInput={styles.input}
                            />
                        </div>

                        <div className={styles.form_group}>
                            <label
                                htmlFor="matKhauNhapLai"
                                className={styles.label}
                            >
                                Xác nhận mật khẩu mới{' '}
                                <span className={styles.required}>*</span>
                            </label>
                            <Form.Item
                                name="matKhauNhapLai"
                                rules={[
                                    {
                                        required: true,
                                        message: (
                                            <HintText
                                                size="small"
                                                type="error"
                                                text="Vui lòng xác nhận mật khẩu mới"
                                            />
                                        ),
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (
                                                !ValidateService.validateMaxLength(
                                                    value,
                                                    128
                                                )
                                            ) {
                                                return Promise.reject(
                                                    <HintText
                                                        size="small"
                                                        type="error"
                                                        text="Mật khẩu vượt quá giới hạn 128 ký tự"
                                                    />
                                                )
                                            }

                                            if (
                                                value !==
                                                getFieldValue('matKhauMoi')
                                            ) {
                                                return Promise.reject(
                                                    <HintText
                                                        size="small"
                                                        type="error"
                                                        text="Mật khẩu xác nhận không khớp"
                                                    />
                                                )
                                            }

                                            return Promise.resolve()
                                        },
                                    }),
                                ]}
                            >
                                <InputPassword
                                    placeholder="Xác nhận mật khẩu mới"
                                    size="medium"
                                    className={styles.input}
                                />
                            </Form.Item>
                        </div>

                        <div className={styles.button_container}>
                            <Button
                                htmlType="submit"
                                type="primary"
                                shape="square"
                                className={styles.button}
                            >
                                Cập nhật mật khẩu
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword
