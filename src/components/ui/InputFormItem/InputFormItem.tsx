/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */
'use client'
import styles from './InputFormItem.module.scss'
import type React from 'react'

import Input from '../TextField/TextField'
import { Form, type InputProps } from 'antd'
import HintText from '../HintText/HintText'
import { ValidateService } from '@/core/services/Validate.service'
import { useState } from 'react'
import { VscEye, VscEyeClosed } from 'react-icons/vsc'
import { useTranslations } from 'next-intl'

interface IInputProps extends Omit<InputProps, 'size'> {
    size?: 'very_large' | 'large' | 'medium' | 'small' | 'very_small'
    name: string
    classNameFormItem?: string
    classNameInput?: string
    type?:
        | 'default'
        | 'first_name'
        | 'last_name'
        | 'full_name'
        | 'password'
        | 'email'
        | 'website'
        | 'search'
        | 'phone'
        | 'currency'
    required?: boolean
    requiredMessage?: string
    newRules?: any
    disabledOldRule?: boolean
    label?: any
    typeInput?: string
}

const InputFormItem = ({
    name,
    classNameFormItem,
    classNameInput,
    type = 'default',
    required = false,
    requiredMessage,
    newRules,
    disabledOldRule = false,
    label,
    typeInput,
    ...rest
}: IInputProps) => {
    const t = useTranslations('components_ui.inputFormItem')
    const [showPassword, setShowPassword] = useState(false)

    const rules = {
        default: {
            messageRequired: t('pleaseEnterInfo'),
            isInvalid: true,
        },
        first_name: {
            messageRequired: t('pleaseEnterFirstName'),
            isInvalid: (value: string) => {
                if (!ValidateService.validateMaxLength(value, 255))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={t('nameExceedsLimit')}
                        />
                    )
                return ValidateService.validateName(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('invalidNameEntered')}
                          />
                      )
            },
        },
        last_name: {
            messageRequired: t('pleaseEnterLastName'),
            isInvalid: (value: string) => {
                if (!ValidateService.validateMaxLength(value, 255))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={t('nameExceedsLimit')}
                        />
                    )
                return ValidateService.validateName(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('invalidNameEntered')}
                          />
                      )
            },
        },
        full_name: {
            // messageRequired: t('pleaseEnterFullName'),
            messageRequired: 'Vui lòng nhập họ tên.',
            isInvalid: (value: string) => {
                if (!ValidateService.validateMaxLength(value, 255))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            // text={t('nameExceedsLimit')}
                            text={'Tên vượt quá giới hạn cho phép'}
                        />
                    )
                return ValidateService.validateName(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              //   text={t('invalidNameEntered')}
                              text={'Tên không hợp lệ'}
                          />
                      )
            },
        },
        password: {
            messageRequired: t('pleaseEnterPassword'),
            isInvalid: (value: string) => {
                if (!ValidateService.validateMaxLength(value, 128))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={t('passwordExceedsLimit')}
                        />
                    )
                return ValidateService.validatePassword(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('passwordCharacterNumberRequirement')}
                          />
                      )
            },
        },
        email: {
            messageRequired: t('pleaseEnterEmail'),
            isInvalid: (value: string) => {
                if (!ValidateService.validateLength(value, 0, 150))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={t('accountExceedsLimit')}
                        />
                    )
                return ValidateService.validateEmail(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('invalidEmailFormat')}
                          />
                      )
            },
        },
        website: {
            messageRequired: t('pleaseEnterWebsite'),
            isInvalid: (value: string) => {
                if (!ValidateService.validateLength(value, 0, 2000))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={t('websiteExceedsLimit')}
                        />
                    )
                return ValidateService.validateURL(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('invalidWebsiteFormat')}
                          />
                      )
            },
        },
        search: {
            messageRequired: t('pleaseEnterWebsite'),
            isInvalid: (value: string) => {
                return ValidateService.validateLength(value, 0, 2000)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={t('searchExceedsLimit')}
                          />
                      )
            },
        },
        phone: {
            // messageRequired: t('pleaseEnterPhoneNumber'),
            messageRequired: 'Vui lòng nhập số điện thoại.',
            isInvalid: (value: string) => {
                if (!ValidateService.validateLength(value, 10, 10))
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={'Số điện thoại không hợp lệ'}
                        />
                    )
                return ValidateService.validatePhoneNumber(value)
                    ? Promise.resolve()
                    : Promise.reject(
                          <HintText
                              size="small"
                              type="error"
                              text={'Số điện thoại không hợp lệ'}
                          />
                      )
            },
        },
        currency: {
            messageRequired: 'Vui lòng nhập giá tiền.',
            isInvalid: (value: string | number) => {
                // Chuyển đổi giá trị thành số
                const numValue =
                    typeof value === 'string'
                        ? Number(value.replace(/[^0-9]/g, ''))
                        : value

                // Kiểm tra xem có phải là số hợp lệ không
                if (isNaN(numValue)) {
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={'Giá tiền phải là số'}
                        />
                    )
                }

                // Kiểm tra giá trị không âm
                if (numValue < 0) {
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={'Giá tiền không được âm'}
                        />
                    )
                }

                // Kiểm tra giá trị tối đa
                if (numValue > 1000000000) {
                    return Promise.reject(
                        <HintText
                            size="small"
                            type="error"
                            text={'Giá tiền không được vượt quá 1 tỷ đồng'}
                        />
                    )
                }

                return Promise.resolve()
            },
        },
    }

    // Lấy form từ context
    const form = Form.useFormInstance()

    // Xử lý input tiền tệ
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'currency') {
            // Chỉ cho phép nhập số
            const value = e.target.value.replace(/[^0-9]/g, '')

            // Cập nhật giá trị vào form (giá trị số)
            form.setFieldsValue({
                [name]: value ? Number(value) : '',
            })
        }
    }

    return (
        <Form.Item
            name={name}
            className={classNameFormItem}
            label={label}
            rules={[
                {
                    required,
                    message: (
                        <HintText
                            size="small"
                            type="error"
                            text={
                                requiredMessage || rules[type]?.messageRequired
                            }
                        />
                    ),
                },
                {
                    validator: async (_, value) => {
                        if (disabledOldRule) return Promise.resolve()
                        if (!value && value !== 0) return Promise.resolve()
                        const isInvalid = rules[type].isInvalid
                        if (typeof isInvalid === 'function') {
                            return isInvalid(value)
                        } else {
                            return isInvalid
                                ? Promise.resolve()
                                : Promise.reject(
                                      <HintText
                                          size="small"
                                          type="error"
                                          text={''}
                                      />
                                  )
                        }
                    },
                },
                ...(newRules || []),
            ]}
            getValueFromEvent={(e) => {
                if (type === 'currency') {
                    // Chỉ lấy số từ input
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    return value ? Number(value) : ''
                }
                return e.target.value
            }}
            normalize={(value) => {
                if (
                    type === 'currency' &&
                    value !== undefined &&
                    value !== null
                ) {
                    // Chuyển đổi thành số khi lưu vào form
                    return typeof value === 'string'
                        ? Number(value.replace(/[^0-9]/g, ''))
                        : value
                }
                return value
            }}
        >
            {type === 'password' ? (
                <Input
                    type={showPassword ? 'text' : 'password'}
                    className={classNameInput}
                    suffix={
                        type === 'password' && showPassword ? (
                            <VscEye
                                onClick={() => setShowPassword(false)}
                                className={styles.eye_icon}
                            />
                        ) : (
                            <VscEyeClosed
                                onClick={() => setShowPassword(true)}
                                className={styles.eye_icon}
                            />
                        )
                    }
                    {...rest}
                />
            ) : type === 'currency' ? (
                <Input
                    className={classNameInput}
                    type="text"
                    onChange={handleCurrencyChange}
                    {...rest}
                />
            ) : (
                <Input className={classNameInput} type={typeInput} {...rest} />
            )}
        </Form.Item>
    )
}

export default InputFormItem
