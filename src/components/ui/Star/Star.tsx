/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Star as LucideStar, LucideProps } from 'lucide-react'
import styles from './Star.module.scss'

interface StarProps extends LucideProps {
    size?: number
    fill?: string
    stroke?: string
}

const Star: React.FC<StarProps> = ({
    size = 16,
    fill = 'none',
    stroke = '#000',
    className,
    ...rest
}) => {
    return (
        <LucideStar
            size={size}
            fill={fill}
            stroke={stroke}
            className={`${styles.star} ${className || ''}`}
            {...rest}
        />
    )
}

export default Star