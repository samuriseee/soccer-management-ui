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
import { useEffect, useState } from 'react'
import { Upload, MapPin, Clock, Info } from 'lucide-react'
import styles from './FootballFieldInfo.module.scss'
import BasicInformation from './BasicInformation/BasicInformation'
import LocationSelector from './LocationSelector/LocationSelector'
import ImageUpload from './ImageUpload/ImageUpload'
import OperatingHours from './OperatingHours/OperatingHours'
import Button from '@/components/ui/Button/Button'
import { Form } from 'antd'
import HintText from '@/components/ui/HintText/HintText'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fooballFieldInfoService } from '@/core/services/API/FootballFieldInfo/FootballFieldInfo.service'
import { showMessage } from '@/components/ui/Notification/Notification'

interface SanBongData {
    tenSan: string
    diaChi: string
    quanHuyen: string
    phuongXa: string
    thanhPho: string
    moTa: string
    media: File[]
    gioMoCua: string
    gioDongCua: string
}

const FootballFieldInfo = () => {
    const [form] = Form.useForm()
    const [activeTab, setActiveTab] = useState<string>('thong-tin')
    const [previewImages, setPreviewImages] = useState<any[]>([])
    const [mediaIdToRemove, setMediaIdToRemove] = useState<string[]>([])
    const queryClient = useQueryClient()    

    const { data, isLoading, isError } = useQuery({
        queryKey: ['san-bong-info'],
        queryFn: () => fooballFieldInfoService.getFootballFieldInfo(),
        // check it later
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: 1,
    })

    const isCreating = !data

    const createMutation = useMutation({
        mutationFn: fooballFieldInfoService.createFootballFieldInfo,
        onSuccess: () => {
            showMessage('success', 'Tạo thông tin sân bóng thành công!')
            queryClient.invalidateQueries({ queryKey: ['san-bong-info'] })
            setMediaIdToRemove([]) // reset
        },
        onError: () => {
            showMessage('error', 'Lỗi khi tạo thông tin sân bóng.')
        },
    })

    const updateMutation = useMutation({
        mutationFn: fooballFieldInfoService.updateFootballFieldInfo,
        onSuccess: () => {
            showMessage('success', 'Cập nhật thông tin sân bóng thành công!')
            queryClient.invalidateQueries({ queryKey: ['san-bong-info'] })
            setMediaIdToRemove([]) // reset
        },
        onError: () => {
            showMessage('error', 'Lỗi khi cập nhật thông tin sân bóng.')
        },
    })

    // useEffect(() => {
    //     if (data?.media) {
    //         const urls = data.media.map((m: any) => m.link)
    //         setPreviewImages(urls)
    //     }
    // }, [data])

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                tenSan: data.tenSan,
                diaChi: data.diaChi,
                quanHuyen: data.quanHuyen,
                phuongXa: data.phuongXa,
                thanhPho: data.thanhPho,
                moTa: data.moTa,
                media: [],
                gioMoCua: data.gioMoCua,
                gioDongCua: data.gioDongCua,
            })
            setPreviewImages(
                (data.media || []).map(
                    (item: { mediaId: string; link: string }) => ({
                        mediaId: item.mediaId,
                        link: item.link,
                    })
                )
            )
        }
    }, [data, form])

    const handleLocationSelect = (location: {
        thanhPho: string
        quanHuyen: string
        phuongXa: string
        diaChi: string
    }) => {
        form.setFieldsValue({
            diaChi: location.diaChi,
            quanHuyen: location.quanHuyen,
            phuongXa: location.phuongXa,
            thanhPho: location.thanhPho,
        })
    }

    const handleTimeChange = (field: string, value: string) => {
        form.setFieldsValue({
            [field]: value,
        })
    }

    const onFinish = async (values: SanBongData) => {
        console.log('MEDIA TO UPLOAD:', values.media)
        console.log('MEDIA ID TO REMOVE:', mediaIdToRemove)
        const payload = {
            ...values,
            thanhPho: 'Đà Nẵng',
            media: values.media || [],
            mediaIdToRemove: mediaIdToRemove || [],
        }

        if (isCreating) {
            createMutation.mutate(payload)
        } else {
            updateMutation.mutate(payload)
        }
    }

    const handleRemoveInitialImage = (mediaId: string) => {
        setPreviewImages((prev) => prev.filter((img) => img.mediaId !== mediaId))
        setMediaIdToRemove((prev) => [...prev, mediaId])
    }

    return (
        <div className={styles.football_field_info}>
            <div className={styles.title_row}>
                <h1 className={styles.page_title}>Quản lý thông tin sân bóng</h1>
                {data && (
                    <span
                        className={
                            data.daDuyet
                                ? styles.status_approved
                                : styles.status_pending
                        }
                    >
                        {data?.daDuyet ? 'Đã được duyệt' : 'Chưa được duyệt'}
                    </span>
                )}
            </div>
            <div className={styles.info_notice}>
                <Info size={18} className={styles.info_notice_icon} />
                Vui lòng cung cấp đầy đủ và chính xác thông tin về sân bóng của bạn. Điều này giúp chúng tôi xác định vị trí sân và hỗ trợ người chơi dễ dàng tìm kiếm, đặt sân nhanh chóng hơn.
            </div>

            <div className={styles.tab_navigation}>
                <button
                    className={`${styles.tab_button} ${activeTab === 'thong-tin' ? styles.active : ''}`}
                    onClick={() => setActiveTab('thong-tin')}
                >
                    <Info size={18} />
                    <span>Thông tin cơ bản</span>
                </button>
                <button
                    className={`${styles.tab_button} ${activeTab === 'vi-tri' ? styles.active : ''}`}
                    onClick={() => setActiveTab('vi-tri')}
                >
                    <MapPin size={18} />
                    <span>Vị trí</span>
                </button>
                <button
                    className={`${styles.tab_button} ${activeTab === 'gio-hoat-dong' ? styles.active : ''}`}
                    onClick={() => setActiveTab('gio-hoat-dong')}
                >
                    <Clock size={18} />
                    <span>Giờ hoạt động</span>
                </button>
                <button
                    className={`${styles.tab_button} ${activeTab === 'hinh-anh' ? styles.active : ''}`}
                    onClick={() => setActiveTab('hinh-anh')}
                >
                    <Upload size={18} />
                    <span>Hình ảnh</span>
                </button>
            </div>

            <Form
                form={form}
                onFinish={onFinish}
                className={styles.form_container}
                layout="vertical"
            >
                <div className={styles.tab_content}>
                    <div
                        className={`${styles.tab_panel} ${
                            activeTab === 'thong-tin'
                                ? styles.active
                                : styles.hidden
                        }`}
                    >
                        <BasicInformation />
                    </div>

                    <div
                        className={`${styles.tab_panel} ${
                            activeTab === 'vi-tri'
                                ? styles.active
                                : styles.hidden
                        }`}
                    >
                        <LocationSelector
                            onLocationSelect={handleLocationSelect}
                        />
                    </div>

                    <div
                        className={`${styles.tab_panel} ${
                            activeTab === 'gio-hoat-dong'
                                ? styles.active
                                : styles.hidden
                        }`}
                    >
                        <OperatingHours
                            gioMoCua={form.getFieldValue('gioMoCua')}
                            gioDongCua={form.getFieldValue('gioDongCua')}
                            onChange={handleTimeChange}
                        />
                    </div>

                    <div
                        className={`${styles.tab_panel} ${
                            activeTab === 'hinh-anh'
                                ? styles.active
                                : styles.hidden
                        }`}
                    >
                        <Form.Item
                            name="media"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        const initial = previewImages.length
                                        const current = (value || []).length
                                        const total = initial + current

                                        if (total === 0) {
                                            showMessage(
                                                'error',
                                                'Vui lòng tải lên ít nhất 1 hình ảnh'
                                            )
                                            return Promise.reject(
                                                <HintText
                                                    size="small"
                                                    type="error"
                                                    text="Vui lòng tải lên ít nhất 1 hình ảnh"
                                                />
                                            )
                                        }
                                        return Promise.resolve()
                                    },
                                },
                            ]}
                            getValueFromEvent={(e) => e}
                        >
                            <ImageUpload
                                value={form.getFieldValue('media')}
                                onChange={(files) =>
                                    form.setFieldsValue({ media: files })
                                }
                                initialImages={previewImages}
                                onInitialChange={(urls) =>
                                    setPreviewImages(urls)
                                }
                                onRemoveInitialImage={handleRemoveInitialImage}
                            />
                        </Form.Item>
                    </div>
                </div>

                <div className={styles.form_actions}>
                    <Button
                        shape="square"
                        type="primary"
                        className={styles.button_submit}
                        htmlType="submit"
                        disabled={
                            createMutation.isPending || updateMutation.isPending
                        }
                    >
                        {createMutation.isPending || updateMutation.isPending
                            ? 'Đang lưu...'
                            : 'Lưu thông tin sân'}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default FootballFieldInfo
