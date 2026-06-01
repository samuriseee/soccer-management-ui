import React, { FC } from 'react'
import { Select as AntdSelect, SelectProps } from 'antd'
import styles from './Dropdown.module.scss'
import { SizeType } from 'antd/es/config-provider/SizeContext'
import { ANT_SIZE, borderRadiusSizes } from './constants'

interface DropdownProps extends Omit<SelectProps<any>, 'size'> {
    placeholderText: string
    size?: 'very_large' | 'large' | 'middle' | 'small' | 'very_small'
    options: { label: string; value: string | number }[]
}

/**
 * @fileoverview
 * Dropdown component that allows the user to select an item from a list of items.
 *
 * @typedef {('very_large' | 'large' | 'middle' | 'small' | 'very_small')} SizeType - Defines the size type of the dropdown.
 * @typedef {{label: string, value: string | number}} OptionType - Defines the type of options in the dropdown.
 *
 * @interface DropdownProps - Interface for the properties of the Dropdown component.
 * @property {string} placeholderText - Text displayed when the dropdown has no selected value.
 * @property {SizeType} [size="medium"] - Size of the dropdown. Can be "veryLarge", "large", "middle", "small" or "verySmall".
 * @property {OptionType[]} options - List of items for the dropdown, each item has a label and a value.
 *
 * @returns {JSX.Element} - JSX interface of Dropdown.
 */

const Dropdown: FC<DropdownProps> = ({
    placeholderText,
    size = 'middle',
    options,
    ...rest
}) => {
    const antdSize = ANT_SIZE.includes(size) ? (size as SizeType) : undefined

    const borderRadius: number | undefined = borderRadiusSizes[size]

    return (
        <AntdSelect
            placeholder={placeholderText}
            {...rest}
            size={antdSize}
            className={`${styles[`dropdown_${size}`]} ${styles.dropdown}`}
            allowClear={true}
            options={options}
        />
    )
}

export default Dropdown
