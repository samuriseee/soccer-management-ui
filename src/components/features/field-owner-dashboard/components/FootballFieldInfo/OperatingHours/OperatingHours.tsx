/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import { Clock } from 'lucide-react'
import styles from './OperatingHours.module.scss'
import { Form } from 'antd'
import Select from '@/components/ui/Select/Select'
import HintText from '@/components/ui/HintText/HintText'

interface OperatingHoursProps {
    gioMoCua: string
    gioDongCua: string
    onChange: (field: string, value: string) => void
}

const OperatingHours = ({
    gioMoCua,
    gioDongCua,
    onChange,
}: OperatingHoursProps) => {
    const timeOptions = []

    // Tạo các tùy chọn thời gian từ 00:00 đến 23:30 với bước 30 phút
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const formattedHour = hour.toString().padStart(2, '0')
            const formattedMinute = minute.toString().padStart(2, '0')
            timeOptions.push(`${formattedHour}:${formattedMinute}`)
        }
    }

    return (
        <div className={styles.operating_hours}>
            <h2 className={styles.section_title}>Giờ hoạt động</h2>

            <div className={styles.time_container}>
                <div className={styles.time_group}>
                    <label htmlFor="gioMoCua" className={styles.time_label}>
                        Giờ mở cửa <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.time_input_container}>
                        <Form.Item
                            name="gioMoCua"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <HintText
                                            size="small"
                                            type="error"
                                            text={'Chọn giờ mở cửa'}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <Select
                                className={styles.time_select}
                                prefix={
                                    <Clock
                                        size={18}
                                        className={styles.time_icon}
                                    />
                                }
                                value={gioMoCua}
                                onChange={(value) =>
                                    onChange('gioMoCua', value)
                                }
                            >
                                {timeOptions.map((time) => (
                                    <Select.Option
                                        key={`open-${time}`}
                                        value={time}
                                    >
                                        {time}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className={styles.time_group}>
                    <label htmlFor="gioDongCua" className={styles.time_label}>
                        Giờ đóng cửa <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.time_input_container}>
                        <Form.Item
                            name="gioDongCua"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <HintText
                                            size="small"
                                            type="error"
                                            text={'Chọn giờ đóng cửa'}
                                        />
                                    ),
                                },
                            ]}
                        >
                            <Select
                                className={styles.time_select}
                                value={gioDongCua}
                                onChange={(value) =>
                                    onChange('gioDongCua', value)
                                }
                                prefix={
                                    <Clock
                                        size={18}
                                        className={styles.time_icon}
                                    />
                                }
                            >
                                {timeOptions.map((time) => (
                                    <Select.Option
                                        key={`close-${time}`}
                                        value={time}
                                    >
                                        {time}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>
                </div>
            </div>

            <div className={styles.time_info}>
                <h3 className={styles.time_info_title}>
                    Lưu ý về giờ hoạt động
                </h3>
                <ul className={styles.time_info_list}>
                    <li>Giờ hoạt động sẽ được hiển thị cho người thuê sân</li>
                    <li>
                        Người thuê sân chỉ có thể đặt sân trong khoảng thời gian
                        hoạt động
                    </li>
                    <li>Bạn có thể thay đổi giờ hoạt động bất cứ lúc nào</li>
                </ul>
            </div>
        </div>
    )
}

export default OperatingHours
