/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState } from 'react'
import { Modal } from 'antd'
import styles from './ReportModal.module.scss'
import Button from '@/components/ui/Button/Button'

interface ReportModalProps {
    open: boolean
    onCancel: () => void
    onSubmit: (reason: string) => void
    loading?: boolean
}

const ReportModal = ({ open, onCancel, onSubmit, loading }: ReportModalProps) => {
    const [reason, setReason] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const handleOk = async () => {
        setSubmitting(true)
        await onSubmit(reason)
        setSubmitting(false)
        setReason('')
    }

    const handleCancel = () => {
        setReason('')
        onCancel()
    }

    return (
        <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            title={null}
            width={420}
            className={styles.container}
            centered
        >
            <div className={styles.body}>
                <div className={styles.icon_container}>
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ff9800"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <div className={styles.box_text}>
                    <div className={styles.title}>Báo cáo sân bóng này</div>
                    <label
                        className={styles.label}
                        htmlFor="report-reason"
                    >
                        Nhập lý do báo cáo
                    </label>
                </div>
                <textarea
                    id="report-reason"
                    className={styles.textarea}
                    placeholder="Nhập lý do báo cáo..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={5}
                />
                <div className={styles.actions}>
                    <Button
                        onClick={handleCancel}
                        size="small"
                        className={styles.btn_cancel}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleOk}
                        size="small"
                        type="primary"
                        className={styles.btn_submit}
                        loading={loading}
                        disabled={!reason.trim()}
                    >
                        Gửi
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ReportModal
