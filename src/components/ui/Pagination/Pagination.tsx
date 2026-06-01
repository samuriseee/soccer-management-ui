/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Pagination as AntdPagination, PaginationProps } from 'antd'
import styles from './Pagination.module.scss'

interface IPagination extends PaginationProps {
    hoverColor?: 'default' | 'gray'
}

/**
 * Property for the custom Pagination component.
 *
 * @property {'default' | 'gray'} hoverColor - The color when hover item.
 *
 */
const Pagination: React.FC<IPagination> = ({
    hoverColor = 'default',
    disabled,
    ...rest
}) => {
    const custom_class =
        hoverColor === 'default' ? styles.item_border : styles.item_border_gray

    return <AntdPagination className={!disabled ? custom_class : undefined} disabled={disabled} {...rest} />
}

export default Pagination
