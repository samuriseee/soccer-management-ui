/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { FC } from 'react'
import { Input as AntdInput, InputProps } from 'antd'
import style from './Input.module.scss'
import { getSizeClassName, getAntdSizeProp, getBorderRadius } from './ultils'

interface TextFieldProps extends Omit<InputProps, 'size'> {
    size?: 'very_large' | 'large' | 'medium' | 'small' | 'very_small'
}

/**
 * The TextField component displays an input field with various size options and a placeholder.
 *
 * @param {"very_large" | "large" | "medium" | "small" | "very_small"} [size="medium"] - Size of the input.
 */

const TextField: FC<TextFieldProps> = ({
    size = 'medium',
    className,
    ...rest
}) => {
    const sizeClassName = getSizeClassName(size)
    const antdSizeProp = getAntdSizeProp(size)
    const borderRadius = getBorderRadius(size)

    return (
        <AntdInput
            size={antdSizeProp}
            className={`${sizeClassName} ${style.input} ${className ?? ''}`}
            {...rest}
        />
    )
}

export default TextField
