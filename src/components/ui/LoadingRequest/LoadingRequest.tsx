/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React from 'react'
import styles from './LoadingRequest.module.scss'
import { ClipLoader } from 'react-spinners'

const LoadingRequest = ({ isLoading = false }: { isLoading?: boolean }) => {
    return (
        <>
            {isLoading && (
                <div className={styles.layout}>
                    <ClipLoader color={'var(--text-color-brand)'} size={40} />
                </div>
            )}
        </>
    )
}

export default LoadingRequest
