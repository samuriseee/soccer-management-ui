/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { InputNumber, InputNumberProps, Slider } from 'antd'
import styles from './SliderInput.module.scss'

const SliderInput = ({ min, max, inputValue, setInputValue }: any) => {
    const onChange: InputNumberProps['onChange'] = (newValue) => {
        setInputValue(newValue as number)
    }
    return (
        <div className={styles.container}>
                <Slider
                    min={min}
                    max={max}
                    onChange={onChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                />
                <InputNumber
                    min={min}
                    max={max}
                    style={{ margin: '0 16px' }}
                    value={inputValue}
                    onChange={onChange}
                    className={styles.input_number}
                />
        </div>
    )
}

export default SliderInput
