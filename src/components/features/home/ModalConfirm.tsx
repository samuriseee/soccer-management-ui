/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import { Modal } from 'antd'
import styles from './ModalConfirm.module.scss'
import Button from '@/components/ui/Button/Button'
import { useTranslations } from 'next-intl'
import { AlertTriangle, X } from 'lucide-react'

interface ModalConfirmProps {
    open: boolean
    onCancel: (value: boolean) => void
    onClickConfirm: () => void
    title: string
    description: string
    loading?: boolean
}

const ModalConfirm = ({
    open,
    onCancel,
    onClickConfirm,
    title,
    description,
    loading,
}: ModalConfirmProps) => {
    const t = useTranslations('header.ModalConfirm')

    const handleClose = () => {
        onCancel(false)
    }

    return (
        <Modal
            onCancel={handleClose}
            open={open}
            footer={null}
            closeIcon={null}
            className={styles.container}
            centered
            maskClosable={false}
        >
            <div className={`${styles.body} p-6 rounded-md bg-white`}> 
                <div className={`${styles.close_button} absolute top-4 right-4`} onClick={handleClose}>
                    <X size={18} />
                </div>

                <div className={`${styles.icon_container} flex justify-center mb-4`}>
                    <AlertTriangle size={40} className={styles.warning_icon} />
                </div>

                <div className={`${styles.box_text} text-center mb-4`}>
                    <div className={styles.title}>
                        <p className="text-lg font-semibold">{title}</p>
                    </div>
                    <p className={`${styles.desc} text-sm text-gray-600`}>{description}</p>
                </div>

                <div className={`${styles.box_actions} flex justify-center gap-3`}> 
                    <Button onClick={handleClose} size="small" className={styles.btn_cancel}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={onClickConfirm} size="small" type="primary" className={styles.btn_agree} loading={loading}>
                        {!loading && t('confirm')}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ModalConfirm