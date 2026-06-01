/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from "react";
import { DatePicker as AntdDatePicker, DatePickerProps } from "antd";

interface IDatePicker extends DatePickerProps { }

const DatePicker: React.FC<IDatePicker> = ({ ...rest }) => {
  return <AntdDatePicker {...rest} />
};

export default DatePicker;
