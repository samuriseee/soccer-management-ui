/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import { useState, useEffect } from 'react'

function useIsMobile(width: number = 996): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const handleWindowSizeChange = () => {
            setIsMobile(window.innerWidth < width)
        }
        handleWindowSizeChange()
        window.addEventListener('resize', handleWindowSizeChange)
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return isMobile
}

export default useIsMobile
