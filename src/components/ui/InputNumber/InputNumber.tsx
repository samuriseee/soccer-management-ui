import React, { FC } from 'react'
import { InputNumber as InputNumberAntd, InputNumberProps } from 'antd'
import {
    getAntdSizeProp,
    getBorderRadius,
    getSizeClassName,
} from '../TextField/ultils'
import styles from '../TextField/TextField.module.scss'
interface TextFieldProps extends Omit<InputNumberProps, 'size'> {
    size?: 'very_large' | 'large' | 'medium' | 'small' | 'very_small'
}

const InputNumber: FC<TextFieldProps> = ({
    size = 'medium',
    className,
    ...rest
}) => {
    const sizeClassName = getSizeClassName(size)
    const antdSizeProp = getAntdSizeProp(size)
    const borderRadius = getBorderRadius(size)

    return (
        <InputNumberAntd
            size={antdSizeProp}
            className={`${sizeClassName} ${styles.input} ${className ?? ''}`}
            {...rest}
        />
    )
}

export default InputNumber
