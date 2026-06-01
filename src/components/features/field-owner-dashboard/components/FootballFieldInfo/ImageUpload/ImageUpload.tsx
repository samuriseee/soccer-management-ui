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
import { useState, useRef, useEffect } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import styles from './ImageUpload.module.scss'
import { showMessage } from '@/components/ui/Notification/Notification'

interface ImageUploadProps {
    value?: File[]
    onChange?: (files: File[]) => void
    initialImages?: string[]
    onInitialChange?: (urls: string[]) => void
    onRemoveInitialImage?: (mediaId: string) => void
}

const ImageUpload = ({
    value = [],
    onChange,
    initialImages = [],
    onInitialChange,
    onRemoveInitialImage,
}: ImageUploadProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const MAX_SIZE = 5 * 1024 * 1024
    const MAX_IMAGES = 10

    const previewImages = [
        ...value.map((file) => ({
            mediaId: undefined,
            url: URL.createObjectURL(file),
        })),
        ...initialImages.map((img: any) =>
            typeof img === 'string'
                ? { mediaId: undefined, url: img }
                : { mediaId: img.mediaId, url: img.link }
        ),
    ]

    useEffect(() => {
        // Tạo một mảng chứa các URL cho những file ảnh mới
        const imageUrls = value.map((file) => URL.createObjectURL(file))

        // Cleanup khi component unmount hoặc giá trị thay đổi
        return () => {
            imageUrls.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [value])

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!isDragging) {
            setIsDragging(true)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files)
            const invalidFiles = filesArray.filter(
                (file) => !file.type.startsWith('image/')
            )

            if (invalidFiles.length > 0) {
                showMessage(
                    'error',
                    'Chỉ được phép tải lên file hình ảnh (JPG, PNG, GIF).'
                )
                return
            }

            const largeFiles = filesArray.filter((file) => file.size > MAX_SIZE)
            if (largeFiles.length > 0) {
                showMessage('error', 'Mỗi ảnh phải nhỏ hơn 5MB.')
                return
            }

            if (value.length + filesArray.length > MAX_IMAGES) {
                showMessage(
                    'error',
                    `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh.`
                )
                return
            }

            const validImages = filesArray.filter(
                (file) =>
                    file.type.startsWith('image/') && file.size <= MAX_SIZE
            )
            onChange?.([...value, ...validImages])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)

            const invalidFiles = filesArray.filter(
                (file) => !file.type.startsWith('image/')
            )

            if (invalidFiles.length > 0) {
                showMessage(
                    'error',
                    'Chỉ được phép tải lên file hình ảnh (JPG, PNG, GIF).'
                )
                return
            }

            const largeFiles = filesArray.filter((file) => file.size > MAX_SIZE)
            if (largeFiles.length > 0) {
                showMessage('error', 'Mỗi ảnh phải nhỏ hơn 5MB.')
                return
            }

            if (value.length + filesArray.length > MAX_IMAGES) {
                showMessage(
                    'error',
                    `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh.`
                )
                return
            }

            const validImages = filesArray.filter(
                (file) =>
                    file.type.startsWith('image/') && file.size <= MAX_SIZE
            )
            onChange?.([...value, ...validImages])
        }
    }

    const handleButtonClick = () => {
        if (value.length >= MAX_IMAGES) {
            showMessage(
                'error',
                `Chỉ được phép tải lên tối đa ${MAX_IMAGES} ảnh.`
            )
            return
        }
        fileInputRef.current?.click()
    }

    const handleRemoveImage = (index: number) => {
        if (index >= value.length) {
            const realIndex = index - value.length
            const newInitials = [...initialImages]
            let removedMediaId: string | undefined
            if (
                typeof newInitials[realIndex] === 'object' &&
                newInitials[realIndex] !== null &&
                'mediaId' in newInitials[realIndex]
            ) {
                removedMediaId = (newInitials[realIndex] as any).mediaId
            }
            newInitials.splice(realIndex, 1)
            onInitialChange?.(newInitials)
            if (removedMediaId) {
                onRemoveInitialImage?.(removedMediaId)
            }
        } else {
            const newFiles = value.filter((_, i) => i !== index)
            onChange?.(newFiles)
        }
    }

    return (
        <div className={styles.image_upload}>
            <h2 className={styles.section_title}>Hình ảnh sân bóng</h2>

            <div
                className={`${styles.upload_area} ${isDragging ? styles.dragging : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className={styles.file_input}
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    onClick={(e) => {
                        const input = e.currentTarget
                        input.value = ''
                    }}
                />

                <div className={styles.upload_content}>
                    <div className={styles.upload_icon}>
                        <Upload size={32} />
                    </div>
                    <h3 className={styles.upload_title}>
                        Kéo thả hình ảnh vào đây
                    </h3>
                    <p className={styles.upload_description}>
                        Hoặc{' '}
                        <button
                            type="button"
                            className={styles.browse_button}
                            onClick={handleButtonClick}
                        >
                            chọn từ thiết bị
                        </button>
                    </p>
                    <p className={styles.upload_hint}>
                        Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB mỗi ảnh)
                    </p>
                </div>
            </div>

            {previewImages.length > 0 && (
                <div className={styles.preview_container}>
                    <h3 className={styles.preview_title}>
                        Hình ảnh đã chọn ({previewImages.length})
                    </h3>

                    <div className={styles.preview_grid}>
                        {previewImages.map((img, index) => (
                            <div key={index} className={styles.preview_item}>
                                <div className={styles.preview_image_container}>
                                    <img
                                        src={img.url}
                                        alt={`Preview ${index + 1}`}
                                        className={styles.preview_image}
                                    />
                                    <button
                                        type="button"
                                        className={styles.remove_button}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className={styles.preview_item}>
                            <button
                                type="button"
                                className={styles.add_more_button}
                                onClick={handleButtonClick}
                            >
                                <ImageIcon size={24} />
                                <span>Thêm ảnh</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageUpload
