/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { RadioProps, Radio as AntdRadio } from 'antd'
import React from 'react'

const Radio = ({ ...rest }: RadioProps) => {
    return <AntdRadio {...rest} />
}

Radio.Group = AntdRadio.Group

export default Radio
