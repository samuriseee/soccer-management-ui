/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Image, ImageProps } from 'antd'
import { IconEye } from '@tabler/icons-react'

const CustomImage: React.FC<ImageProps> = ({ preview, ...rest }) => {
    // If `preview` is an object or not provided (undefined), use the default preview with custom mask
    const isPreviewObject =
        (typeof preview === 'object' && preview !== null) ||
        preview === undefined

    const defaultPreview = isPreviewObject
        ? {
              mask: (
                  <div
                      style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                      }}
                  >
                      <IconEye style={{ fontSize: '20px' }} />
                      <span>Xem trước</span>
                  </div>
              ),
              ...preview,
          }
        : preview

    return <Image preview={defaultPreview} {...rest} />
}

export default CustomImage
