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
import styles from './FootballFieldSection.module.scss'
import FootballFieldCard from '@/components/features/fields/components/FootballFieldCard/FootballFieldCard'
import Pagination from '@/components/ui/Pagination/Pagination'
import { useRouter } from '@/navigation'
import { NAVIGATION_PATHS } from '@/constants/constants'
import LoadingCardGrid from '@/components/ui/LoadingCardGrid/LoadingCardGrid'
import { useQuery } from '@tanstack/react-query'
import { fooballFieldInfoService } from '@/core/services/API/FootballFieldInfo/FootballFieldInfo.service'

const PAGE_SIZE = 9

const FootballFieldSection = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()

    const { data, isLoading } = useQuery({
        queryKey: ['football - fields', currentPage],
        queryFn: () =>
            fooballFieldInfoService.getAllSanBong({
                page: currentPage,
                limit: PAGE_SIZE,
            }),
    })

    const footballFields = data?.data || []

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <section className={styles.football_field_section}>
            <div className={styles.football_field_container}>
                <div className={styles.heading_area}>
                    <h4 className={styles.heading_title}>Danh sách sân bóng</h4>
                    <p
                        className={styles.see_all}
                        onClick={() => router.push(NAVIGATION_PATHS.FIELD_LIST)}
                    >
                        Xem tất cả
                    </p>
                </div>
                {isLoading ? (
                    <LoadingCardGrid
                        itemCount={9}
                        gutter={[24, 24]}
                        customClassName={styles.card_loading}
                        colProps={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }}
                    />
                ) : (
                    <div className={styles.grid_fields}>
                        {footballFields.map((field: any) => (
                            <div key={field.maSanBong}>
                                <FootballFieldCard field={field} />
                            </div>
                        ))}
                    </div>
                )}
                <div className={styles.pagination_wrapper}>
                    <Pagination
                        size="small"
                        hoverColor="gray"
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={data?.total || 0}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </section>
    )
}

export default FootballFieldSection
