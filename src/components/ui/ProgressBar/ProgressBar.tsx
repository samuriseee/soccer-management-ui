/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import { useEffect } from 'react'
import { usePathname } from '@/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const ProgressBar = () => {
    const pathname = usePathname()

    // Disable the spinner
    NProgress.configure({ showSpinner: false })

    useEffect(() => {
        NProgress.start()

        const timer = setTimeout(() => {
            NProgress.done()
        }, 500)

        return () => {
            clearTimeout(timer)
            NProgress.done()
        }
    }, [pathname])
    return null
}

export default ProgressBar
