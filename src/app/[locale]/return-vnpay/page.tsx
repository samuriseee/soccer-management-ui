'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import { showMessage } from '@/components/ui/Notification/Notification'

const ReturnVnpayPage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const handledRef = useRef(false)

    useEffect(() => {
        if (handledRef.current) return

        const success = searchParams.get('success')
        const amount = searchParams.get('amount')

        if (success === 'true') {
            const formattedAmount = Number(amount || 0).toLocaleString('vi-VN')
            showMessage(
                'success',
                `Nạp tiền thành công ${formattedAmount}đ. Đang chuyển về trang tài khoản...`
            )
        } else if (success === 'false') {
            showMessage(
                'error',
                'Nạp tiền thất bại. Đang chuyển về trang tài khoản...'
            )
        } else {
            showMessage(
                'warning',
                'Không nhận được thông tin thanh toán từ VNPay.'
            )
        }

        handledRef.current = true

        const timer = window.setTimeout(() => {
            router.replace(NAVIGATION_PATHS.DASH_BOARD_NGUOI_THUE)
        }, 1500)

        return () => window.clearTimeout(timer)
    }, [router, searchParams])

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                background: 'linear-gradient(180deg, #f7fbff 0%, #ffffff 100%)',
                color: '#1f2937',
                textAlign: 'center',
            }}
        >
            <div>
                <h1 style={{ fontSize: 28, marginBottom: 12 }}>
                    Đang xử lý thanh toán
                </h1>
                <p style={{ fontSize: 16, opacity: 0.8 }}>
                    Vui lòng chờ trong giây lát, hệ thống sẽ tự động chuyển bạn
                    về trang tài khoản.
                </p>
            </div>
        </div>
    )
}

export default ReturnVnpayPage
