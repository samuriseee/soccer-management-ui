/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { useCallback, KeyboardEvent } from 'react'

type UseKeyDownHandlerProps = {
    key?: string
    onClick?: () => void
}

const useKeyDownHandler = ({
    key = 'Enter',
    onClick,
}: UseKeyDownHandlerProps = {}) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLElement>) => {
            if (event.key === key) {
                event.preventDefault()
                if (onClick) {
                    onClick()
                } else {
                    event.currentTarget.click()
                }
            }
        },
        [key, onClick]
    )

    return handleKeyDown
}

export default useKeyDownHandler
