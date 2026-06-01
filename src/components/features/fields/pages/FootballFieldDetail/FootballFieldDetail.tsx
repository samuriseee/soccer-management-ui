/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'
import React from 'react'
import styles from './FootballFieldDetail.module.scss'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Layout } from 'antd'
import { Star, Clock, Flag, AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button/Button'
import { renderStars } from '../../utils/RenderStars/renderStars'
import Select from '@/components/ui/Select/Select'
import GalleryComponent from '@/components/ui/GalleryComponent/GalleryComponent'
import ReviewsSection from '../../components/ReviewsSection/ReviewsSection'
import SubFieldCard from '../../components/SubFieldCard/SubFieldCard'
import { fooballFieldInfoService } from '@/core/services/API/FootballFieldInfo/FootballFieldInfo.service'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useFieldTypes } from '@/hooks/useFieldTypes'
import Pagination from '@/components/ui/Pagination/Pagination'
import { subFootballFieldService } from '@/core/services/API/SubFootballField/SubFootballField.service'
import { reviewService } from '@/core/services/API/ReviewService/Review.service'
import dayjs from 'dayjs'
import ReportModal from './ReportModal'
import { reportService } from '@/core/services/API/Report/Report.service'
import { showMessage } from '@/components/ui/Notification/Notification'

const { Option } = Select

const SUB_FIELD_PAGE_SIZE = 8
const REVIEW_PAGE_SIZE = 12

const FootballFieldDetail = () => {
    const params = useParams()
    const maSanBong =
        typeof params.slug === 'string'
            ? params.slug
            : Array.isArray(params.slug)
              ? params.slug[0]
              : ''

    const [selectedFieldType, setSelectedFieldType] = useState('all')
    const [selectedSubField, setSelectedSubField] = useState<string | null>(
        null
    )
    const [currentPage, setCurrentPage] = useState(1)
    const [reviewPage, setReviewPage] = useState(1)
    const [showReportModal, setShowReportModal] = useState(false)

    // Lấy loại sân
    const { data: fieldTypes } = useFieldTypes()

    const { data: fieldData, isLoading, refetch: refetchField } = useQuery({
        queryKey: ['football-field-detail', maSanBong],
        queryFn: () => fooballFieldInfoService.getOneSanBong(maSanBong),
        enabled: !!maSanBong,
    })

    const { data: subFieldsData, isLoading: isLoadingSubFields } = useQuery({
        queryKey: [
            'sub-football-fields',
            maSanBong,
            selectedFieldType,
            currentPage,
            SUB_FIELD_PAGE_SIZE,
        ],
        queryFn: () =>
            subFootballFieldService.getAllSubFootballField(maSanBong, {
                maLoaiSan:
                    selectedFieldType !== 'all' ? selectedFieldType : undefined,
                page: currentPage,
                limit: SUB_FIELD_PAGE_SIZE,
            }),
        enabled: !!maSanBong,
    })

    const { data: reviewsApiData, isLoading: isLoadingReviews, refetch: refetchReviews } = useQuery({
        queryKey: ['reviews', maSanBong, reviewPage, REVIEW_PAGE_SIZE],
        queryFn: () => reviewService.getReviews(maSanBong, { page: reviewPage, limit: REVIEW_PAGE_SIZE }),
        enabled: !!maSanBong,
    })

    const { mutate: createReport, isPending: isReporting } = useMutation({
        mutationFn: (data: { sanBongId: string; lyDo: string }) => reportService.createReport(data),
        onSuccess: () => {
            showMessage('success', 'Gửi báo cáo thành công!')
            setShowReportModal(false)
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Gửi báo cáo thất bại!'
            showMessage('error', errorMessage)
        },
    })

    const handleSubmitReport = (reason: string) => {
        const payLoad = { sanBongId: maSanBong, lyDo: reason }
        createReport(payLoad)
    }

    // Chuẩn hóa dữ liệu reviews từ API cho ReviewsSection
    const reviews = Array.isArray(reviewsApiData?.data)
        ? reviewsApiData.data.map((item: any, idx: number) => ({
              id: idx + '',
              user: item.tenNguoiDanhGia || 'Ẩn danh',
              avatar: item.avatar || '',
              rating: item.diemSo,
              comment: item.binhLuan,
              date: item.thoiGianDanhGia
                  ? dayjs(item.thoiGianDanhGia).format('DD/MM/YYYY HH:mm')
                  : '',
          }))
        : []

    const averageRating = reviewsApiData?.diemTrungBinhDanhGia || 0
    const ratingDistribution = reviewsApiData?.phanPhoiXepHang || {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    }
    const totalReviews = reviewsApiData?.count || 0

    if (isLoading || !fieldData) {
        return <div className={styles.loading}>Đang tải...</div>
    }

    const address = [
        fieldData.diaChi,
        fieldData.phuongXa,
        fieldData.quanHuyen,
        fieldData.thanhPho,
    ]
        .filter(Boolean)
        .join(', ')

    const rating = fieldData.diemTrungBinhDanhGia ?? 0

    // Get link image from media
    const galleryImages =
        Array.isArray(fieldData.media) && fieldData.media.length > 0
            ? fieldData.media.filter((m: any) => m.link).map((m: any) => m.link)
            : []

    const openTime =
        fieldData.gioMoCua && fieldData.gioDongCua
            ? `${fieldData.gioMoCua} - ${fieldData.gioDongCua}`
            : 'Chưa cập nhật'

    // Danh sách sub fields thật
    const subFields = subFieldsData?.data || []
    const totalSubFields = subFieldsData?.total || 0

    return (
        <Layout className={styles.layout}>
            <div className={styles.container}>
                {/* Top section with field info */}
                <div className={styles.field_info}>
                    <div className={styles.field_info_left}>
                        <h1 className={styles.field_name}>
                            {fieldData.tenSan}
                        </h1>
                        <p className={styles.field_address}>{address}</p>

                        <div className={styles.field_images}>
                            <GalleryComponent
                                images={galleryImages}
                                maxDisplay={4}
                            />
                        </div>
                    </div>

                    <div className={styles.field_info_right}>
                        <div className={styles.info_card}>
                            <p className={styles.info_title}>Thông tin sân</p>
                            <div className={styles.info_item}>
                                <div className={styles.info_label}>
                                    Đánh giá
                                </div>
                                <div className={styles.info_value}>
                                    {fieldData.diemTrungBinhDanhGia === null ? (
                                        <span className={styles.no_rating_text}>
                                            Chưa có đánh giá nào
                                        </span>
                                    ) : (
                                        <>
                                            {renderStars(rating)}
                                            <span
                                                className={styles.rating_value}
                                            >
                                                {rating.toFixed(1)}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.info_item}>
                                <div className={styles.info_label}>
                                    <Clock
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    Giờ mở cửa
                                </div>
                                <div className={styles.info_value}>
                                    {openTime}
                                </div>
                            </div>

                            <div className={styles.info_item}>
                                <div className={styles.info_label}>
                                    <Flag
                                        size={16}
                                        className={styles.info_icon}
                                    />
                                    Tổng số sân thi đấu
                                </div>
                                <div className={styles.info_value}>
                                    {fieldData?.soLuongSanChiTiet} sân
                                </div>
                            </div>

                            <Button
                                className={styles.report_button}
                                icon={<AlertTriangle size={16} />}
                                onClick={() => setShowReportModal(true)}
                            >
                                Báo cáo
                            </Button>
                            <ReportModal
                                open={showReportModal}
                                onCancel={() => setShowReportModal(false)}
                                onSubmit={handleSubmitReport}
                                loading={isReporting}
                            />
                        </div>
                    </div>
                </div>

                {/* Sub-fields section */}
                <div className={styles.sub_fields_section}>
                    <div className={styles.section_header}>
                        <h2 className={styles.section_title}>
                            Danh sách sân chi tiết
                        </h2>
                        <Select
                            value={selectedFieldType}
                            className={styles.field_type_select}
                            onChange={(value) => {
                                setSelectedFieldType(value)
                                setCurrentPage(1)
                            }}
                        >
                            <Option value="all">Tất cả</Option>
                            {fieldTypes?.map((type: any) => (
                                <Option
                                    key={type.maLoaiSan}
                                    value={type.maLoaiSan}
                                >
                                    {type.tenLoaiSan}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div className={styles.sub_fields_list}>
                        {isLoadingSubFields ? (
                            <div>Đang tải...</div>
                        ) : subFields.length === 0 ? (
                            <div className={styles.no_sub_field}>
                                Không có sân chi tiết nào phù hợp
                            </div>
                        ) : (
                            subFields.map((subField: any) => (
                                <SubFieldCard
                                    key={subField.maSanChiTiet}
                                    maSanChiTiet={subField.maSanChiTiet}
                                    tenSanChiTiet={subField.tenSanChiTiet}
                                    tenLoaiSan={subField.tenLoaiSan}
                                    giaThueBuoiSang={subField.giaThueBuoiSang}
                                    giaThueBuoiToi={subField.giaThueBuoiToi}
                                    media={subField.media}
                                    isSelected={
                                        selectedSubField ===
                                        subField.maSanChiTiet
                                    }
                                    onSelect={setSelectedSubField}
                                    gioMoCua={fieldData.gioMoCua}
                                    gioDongCua={fieldData.gioDongCua}
                                />
                            ))
                        )}
                    </div>
                    <div className={styles.pagination_wrapper}>
                        <Pagination
                            current={currentPage}
                            pageSize={SUB_FIELD_PAGE_SIZE}
                            total={totalSubFields}
                            onChange={setCurrentPage}
                            size="small"
                        />
                    </div>
                </div>

                <ReviewsSection
                    maSanBong={maSanBong}
                    reviews={reviews}
                    averageRating={averageRating}
                    ratingDistribution={ratingDistribution}
                    refetchReviews={refetchReviews}
                    refetchField={refetchField}
                    reviewPage={reviewPage}
                    setReviewPage={setReviewPage}
                    pageSize={REVIEW_PAGE_SIZE}
                    totalReviews={totalReviews}
                />
            </div>
        </Layout>
    )
}

export default FootballFieldDetail
