/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Switch as AntdSwitch, SwitchProps } from 'antd'

const Switch: React.FC<SwitchProps> = ({ ...rest }) => {
    return <AntdSwitch {...rest} />
}

export default Switch