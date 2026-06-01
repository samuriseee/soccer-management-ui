/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import Button from '@/components/ui/Button/Button'
import React from 'react'
import styles from './RegisterChoice.module.scss'
import { IconArrowRight } from '@tabler/icons-react'

interface RegisterChoiceProps {
    title: string
    description: string
    type: 'owner' | 'renter'
    onClick: () => void
    textButton: string
}

const RegisterChoice: React.FC<RegisterChoiceProps> = ({
    title,
    description,
    type,
    onClick,
    textButton,
}) => {
    return (
        <div
            className={`${styles.choice_box} ${type === 'owner' ? styles.owner : styles.renter}`}
        >
            <h3 className={styles.choice_title}>{title}</h3>
            <p className={styles.choice_description}>{description}</p>
            <Button
                className={styles.register_button}
                onClick={onClick}
                shape="square"
            >
                {textButton}
                <IconArrowRight />
            </Button>
        </div>
    )
}

export default RegisterChoice
