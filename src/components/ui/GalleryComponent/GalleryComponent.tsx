/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import { Image } from 'antd'
import styles from './GalleryComponent.module.scss'
import CustomImage from '../CustomImage/CustomImage'

interface GalleryProps {
    images: string[]
    maxDisplay?: number
}

const GalleryComponent: React.FC<GalleryProps> = ({
    images,
    maxDisplay = 4,
}) => {
    const [previewVisible, setPreviewVisible] = useState(false)

    return (
        <div className={styles.gallery_container}>
            <Image.PreviewGroup
                preview={{
                    visible: previewVisible,
                    onVisibleChange: (vis) => setPreviewVisible(vis),
                }}
            >
                <div className={styles.image_grid}>
                    {images.slice(0, maxDisplay).map((src, index) => (
                        <div key={index} className={styles.image_wrapper}>
                            <CustomImage
                                width="100%"
                                height="100%"
                                className={styles.image_style}
                                src={src}
                            />
                        </div>
                    ))}

                    {images.length > maxDisplay && (
                        <div
                            className={styles.overlay}
                            onClick={() => setPreviewVisible(true)}
                        >
                            <span className={styles.overlay_text}>
                                +{images.length - maxDisplay}
                            </span>
                        </div>
                    )}
                </div>

                {images.slice(maxDisplay).map((src, index) => (
                    <Image
                        key={index + maxDisplay}
                        className={styles.hidden_image}
                        src={src}
                    />
                ))}
            </Image.PreviewGroup>
        </div>
    )
}

export default GalleryComponent
