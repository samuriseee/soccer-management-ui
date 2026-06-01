/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Breadcrumb as AntdBreadcrumb, BreadcrumbProps } from 'antd'
import React from 'react'
import styles from './BreadCrumb.module.scss'

interface IBreadCrumb extends BreadcrumbProps {
    size?: 'large' | 'small'
}

/**
 * Property for the custom BreadCrumb component.
 *
 * @property {string} size - Font size of text. {'large' | 'small'}
 */

const Breadcrumb: React.FC<IBreadCrumb> = ({ size = 'large', ...rest }) => {
    const classCustom = `${styles[`bread_crumb_${size}`]}`

    return <AntdBreadcrumb className={classCustom} {...rest} />
}

export default Breadcrumb
