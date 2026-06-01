/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React, { useState, useEffect } from 'react'
import styles from './FootballFieldList.module.scss'
import FootballFieldCard from '../../components/FootballFieldCard/FootballFieldCard'
import { Layout } from 'antd'
import SearchFootballField from '../../components/SearchFootballField/SearchFootballField'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fooballFieldInfoService } from '@/core/services/API/FootballFieldInfo/FootballFieldInfo.service'
import Button from '@/components/ui/Button/Button'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

const PAGE_SIZE = 12

const FootballFieldList = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
    const [selectedWard, setSelectedWard] = useState<string | null>(null)
    const [kinhDo, setKinhDo] = useState<number | undefined>(undefined)
    const [viDo, setViDo] = useState<number | undefined>(undefined)

    // Lấy filter từ URL khi mount
    useEffect(() => {
        setSearch(searchParams.get('search') || '')
        setSelectedDistrict(searchParams.get('quanHuyen') || null)
        setSelectedWard(searchParams.get('phuongXa') || null)
        setKinhDo(
            searchParams.get('kinhDo')
                ? Number(searchParams.get('kinhDo'))
                : undefined
        )
        setViDo(
            searchParams.get('viDo')
                ? Number(searchParams.get('viDo'))
                : undefined
        )
    }, [searchParams])

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        refetch,
    } = useInfiniteQuery({
        queryKey: [
            'football-fields',
            search,
            selectedDistrict,
            selectedWard,
            kinhDo,
            viDo,
        ],
        queryFn: async ({ pageParam = 1 }) =>
            fooballFieldInfoService.getAllSanBong({
                search: search || undefined,
                quanHuyen: selectedDistrict || undefined,
                phuongXa: selectedWard || undefined,
                kinhDo,
                viDo,
                page: pageParam,
                limit: PAGE_SIZE,
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (Array.isArray(lastPage)) {
                return lastPage.length === PAGE_SIZE
                    ? allPages.length + 1
                    : undefined
            }
            if (lastPage?.page && lastPage?.totalPage) {
                return lastPage.page < lastPage.totalPage
                    ? lastPage.page + 1
                    : undefined
            }
            return undefined
        },
        initialPageParam: 1,
    })

    const footballFields = data
        ? data.pages.flatMap((page) => (Array.isArray(page) ? page : page.data))
        : []

    // Thêm sân test có điểm đánh giá
    // footballFields.push({
    //     maSanBong: 'test-1',
    //     tenSan: 'Sân này để test ngôi sao đánh giá (sân giả)',
    //     diaChi: '123 Đường Test',
    //     quanHuyen: 'Hải Châu',
    //     phuongXa: 'Phước Ninh',
    //     thanhPho: 'Đà Nẵng',
    //     diemTrungBinhDanhGia: 4,
    //     media: [
    //         {
    //             link: 'https://www.nhavanhoasinhvien.vn/wp-content/uploads/2022/12/%E1%BA%A2nh-ch%E1%BB%A5p-M%C3%A0n-h%C3%ACnh-2022-12-08-l%C3%BAc-10.09.05.png',
    //         },
    //     ],
    // })

    const totalCount = data?.pages?.[0]?.total ?? footballFields.length
    
    const handleClearNearby = () => {
        setKinhDo(undefined)
        setViDo(undefined)
        setSelectedDistrict(null)
        setSelectedWard(null)

        // Xóa kinhDo, viDo, quanHuyen, phuongXa khỏi URL nếu có
        const params = new URLSearchParams(searchParams.toString())
        params.delete('kinhDo')
        params.delete('viDo')
        params.delete('quanHuyen')
        params.delete('phuongXa')
        params.delete('search')
        router.replace(`${pathname}?${params.toString()}`)

        refetch()
    }

    // Khi search/filter, cập nhật URL param và state để luôn đồng bộ với API
    const handleSearch = (params: {
        search?: string
        selectedDistrict?: string | null
        selectedWard?: string | null
        kinhDo?: number
        viDo?: number
        trigger?: string
    }) => {
        setSearch(params.search || '')
        setSelectedDistrict(params.selectedDistrict || null)
        setSelectedWard(params.selectedWard || null)
        setKinhDo(params.kinhDo)
        setViDo(params.viDo)

        // Luôn cập nhật search param lên URL khi trigger là 'search'
        if (params.trigger === 'search') {
            const urlParams = new URLSearchParams()
            if (params.search) urlParams.set('search', params.search)
            if (params.selectedDistrict) urlParams.set('quanHuyen', params.selectedDistrict)
            if (params.selectedWard) urlParams.set('phuongXa', params.selectedWard)
            if (params.kinhDo) urlParams.set('kinhDo', String(params.kinhDo))
            if (params.viDo) urlParams.set('viDo', String(params.viDo))
            router.replace(`${pathname}?${urlParams.toString()}`)
            refetch()
        } else if (params.trigger === 'nearby') {
            refetch()
        }
    }

    return (
        <Layout className={styles.layout}>
            <div className={styles.fields_container}>
                <SearchFootballField
                    search={search}
                    selectedDistrict={selectedDistrict}
                    selectedWard={selectedWard}
                    onSearch={handleSearch}
                />
                {(kinhDo !== undefined && viDo !== undefined) || search ? (
                    <Button
                        type="default"
                        onClick={handleClearNearby}
                        className={styles.clear_nearby_button}
                        size="small"
                    >
                        Bỏ lọc, xem tất cả sân bóng
                    </Button>
                ) : null}
                <div className={styles.fields_content}>
                    <div className={styles.fields_box_title}>
                        <h1 className={styles.field_count}>
                            Có <span className={styles.field_count_number}>{totalCount}</span> sân bóng được tìm thấy
                        </h1>
                        {/* <div>Right</div> */}
                    </div>
                    <div className={styles.fields_list}>
                        {isLoading && <div>Đang tải...</div>}
                        {isError && <div>Đã xảy ra lỗi!</div>}
                        {!isLoading &&
                            !isError &&
                            footballFields.map((field: any) => (
                                <FootballFieldCard
                                    key={field.maSanBong}
                                    field={field}
                                />
                            ))}
                    </div>
                    {hasNextPage && (
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            style={{ margin: '24px auto 0', display: 'block' }}
                        >
                            {isFetchingNextPage ? 'Đang tải...' : 'Tải thêm'}
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    )
}

export default FootballFieldList
