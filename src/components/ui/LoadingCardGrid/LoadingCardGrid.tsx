/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import { Row, Col, Card } from 'antd'

interface LoadingCardGridProps {
    itemCount: number
    gutter?: [number, number]
    customClassName?: string
    colProps?: {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
    }
}

const LoadingCardGrid: React.FC<LoadingCardGridProps> = ({
    itemCount,
    gutter = [20, 20],
    customClassName,
    colProps = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 },
}) => {
    return (
        <Row gutter={gutter} className={customClassName}>
            {Array.from({ length: itemCount }).map((_, index) => (
                <Col {...colProps} key={index}>
                    <Card loading />
                </Col>
            ))}
        </Row>
    )
}

export default LoadingCardGrid
