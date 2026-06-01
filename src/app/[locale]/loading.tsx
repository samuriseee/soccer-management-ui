/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

export default function Loading() {
    // return <Spin fullscreen indicator={<LoadingOutlined spin />} size="large" />
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backgroundColor: 'rgba(10, 101, 204, 0.15)',
                zIndex: 9999,
            }}
        >
            <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
    )
}
