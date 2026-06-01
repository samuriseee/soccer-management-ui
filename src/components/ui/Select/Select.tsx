/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Select as AntdSelect, SelectProps, Empty } from 'antd'
import { IoIosArrowDown } from 'react-icons/io'
import { useTranslations } from 'next-intl'

const { Option } = AntdSelect

const Select: React.FC<SelectProps> & { Option: typeof Option } = ({
    notFoundContent,
    ...rest
}) => {
    const t = useTranslations('components_ui.select')
    return (
        <AntdSelect
            suffixIcon={<IoIosArrowDown size={20} color={'var(--text-color-secondary)'} />}
            notFoundContent={
                notFoundContent || (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('noData')} />
                )
            }
            {...rest}
        />
    )
}

Select.Option = Option

export default Select
