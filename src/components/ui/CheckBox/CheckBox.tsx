/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */ 

import React from 'react'
import { Checkbox as AtdCheckBox, CheckboxProps } from 'antd'

const Checkbox: React.FC<CheckboxProps> = ({ ...rest }) => {
    return <AtdCheckBox {...rest} />
}

export default Checkbox
