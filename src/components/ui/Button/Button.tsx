/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { Button as AntdButton, ButtonProps } from 'antd'
import styles from './Button.module.scss'
import { getSizeClass } from './ultils'

interface IButton
    extends Omit<ButtonProps, 'size' | 'type' | 'shape' | 'className'> {
    size?: 'very_large' | 'large' | 'middle' | 'small' | 'very_small'
    type?:
        | 'primary'
        | 'default'
        | 'black_primary'
        | 'black_secondary'
        | 'white_primary'
        | 'white_secondary'
        | 'text'
    shape?: 'circle' | 'square'
    color?:
        | 'danger'
        | 'primary'
        | 'default'
        | 'blue'
        | 'purple'
        | 'cyan'
        | 'green'
        | 'magenta'
        | 'pink'
        | 'red'
        | 'orange'
        | 'yellow'
        | 'volcano'
        | 'geekblue'
        | 'lime'
        | 'gold'
    subcontent?: string
    className?: string
}

/**
 * Property for the custom Button component.
 *
 * @property {string}  size  - The size of the button. {'veryLarge' | 'large' | 'middle' | 'small' | 'verySmall'} .
 * @property {string} type - The type of the button. {'primary' | 'default' | 'blackPrimary' | 'blackSecondary' | 'whitePrimary' | 'whiteSecondary' | 'text'}.
 * @property {string} shape - The shape of the button. {'circle' | 'square'}
 * @property {string} color - The color of the text button. {'white' | 'primary'}
 * @property {string} subcontent - The subcontent of the square button.
 * @property {ReactNode} icon - The icon of the button.
 */

const Button: React.FC<IButton> = ({
    color = 'primary',
    size = 'middle',
    type = 'default',
    shape = 'circle',
    subcontent = '',
    icon,
    loading,
    children,
    className,
    ...rest
}) => {
    const getCustomClassName = () => {
        if (type !== 'text') {
            const sizeClass = getSizeClass(size, icon, shape, children)
            const typeClass = styles[type]
            const subcontentClass = `${styles.square_button} ${icon && styles.square_button_icon}`
            return `${sizeClass} ${typeClass} ${shape === 'square' && subcontentClass}`
        } else {
            return ''
        }
    }

    const ANTD_TYPES = ['primary', 'default', 'text']
    const ANTD_SIZES = ['large', 'middle', 'small']

    const antdSize = ANTD_SIZES.find((it) => it === size) as ButtonProps['size']
    const antdType = ANTD_TYPES?.find(
        (it) => it === type
    ) as ButtonProps['type']

    const isSquareShape = shape === 'square'
    return (
        <AntdButton
            className={`${styles.custom_button} ${getCustomClassName()} ${className ?? ''}`}
            size={antdSize}
            type={antdType}
            shape={shape === 'square' ? 'default' : 'round'}
            icon={icon}
            loading={loading}
            {...rest}
        >
            {children}
            {subcontent && <div className={styles.sub_content}>{subcontent}</div>}
        </AntdButton>
    )
    
}
export default Button
