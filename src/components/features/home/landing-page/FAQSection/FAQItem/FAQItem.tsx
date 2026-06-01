/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { useState } from 'react'
import styles from './FAQItem.module.scss'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'

interface FAQItemProps {
    question: string
    answer: string
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className={styles.faq_item}>
            <div
                className={styles.faq_question}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                {question}
                <div className={styles.icon}>
                    {isOpen ? <IconChevronUp /> : <IconChevronDown />}
                </div>
            </div>
            <div
                className={`${styles.faq_answer} ${isOpen ? styles.faq_answer_open : ''}`}
            >
                <div className={styles.faq_answer_content}>{answer}</div>
            </div>
        </div>
    )
}

export default FAQItem

