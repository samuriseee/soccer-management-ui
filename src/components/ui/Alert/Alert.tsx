/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { ReactNode } from 'react'
import { Alert as AntdAlert, AlertProps } from 'antd'

interface IAlert extends AlertProps {
    type: 'success' | 'info' | 'warning' | 'error'
}

const Alert: React.FC<IAlert> = ({ type, ...rest }) => {
    const colorMap = {
        success: 'var(--text-color-green)',
        info: 'var(--text-color-blue-info-icon)',
        warning: 'var(--text-color-red-warning)',
        error: 'var(--text-color-red-error)',
    }

    return <AntdAlert type={type} style={{ borderRadius: '6px' }} {...rest} />
}

export default Alert
