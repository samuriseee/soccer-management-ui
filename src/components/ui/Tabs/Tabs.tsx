/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Tabs as AntTabs, TabsProps } from 'antd'
import styles from './Tabs.module.scss'

interface ITabs extends Omit<TabsProps, 'size'> {
    size?: 'medium' | 'large'
    items: {
        label: string
        key: string
        children?: React.ReactNode
        disabled?: boolean
        icon?: React.ReactNode
    }[]
    activeColor?: 'default' | 'white' | 'black'
}

/**
 * The `Tabs` component displays a list of tabs.
 *
 * @param {'medium' | 'large'} size - The size of the tabs (default is 'medium').
 * @param {Array} items - An array containing information about the tabs. Each item has the following properties:
 *    - label: The name of the tab.
 *    - key: A unique key to identify the tab.
 *    - children: The child components of the tab.
 *    - disabled: Determines whether the tab is disabled.
 *    - icon: The icon of the tab.
 * @param {"default" | "white" | "black"} props.activeColor - The color of the currently selected tab (default is 'default').
 * @returns {JSX.Element} - The JSX interface of the Tabs component.
 */

const Tabs: React.FC<ITabs> = ({
    size = 'medium',
    items,
    activeColor = 'default',
    ...rest
}) => {
    const isLarge = size === 'large'
    const tabClass = styles[`${size}_tab`]

    return (
        <AntTabs
            defaultActiveKey="1"
            items={items.map((item) => ({
                ...item,
                icon: item.icon
                    ? React.cloneElement(item.icon as React.ReactElement<any>, {
                          className: styles.icon,
                      })
                    : undefined,
            }))}
            className={tabClass}
            {...rest}
        />
    )
}

export default Tabs
