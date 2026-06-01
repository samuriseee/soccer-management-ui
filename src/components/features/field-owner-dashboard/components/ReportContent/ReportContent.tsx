/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import { useState } from 'react'
import {
    Calendar,
    Download,
    BarChart2,
    TrendingUp,
    Users,
    DollarSign,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { timeSlotsService } from '@/core/services/API/TimeSlots/TimeSlots.service'
import Select from '@/components/ui/Select/Select'
import styles from './ReportContent.module.scss'

export interface ReportDashboardData {
    doanhThuTheoThang: Array<{ thang: string; doanhThu: number }> // Doanh thu từng tháng, ví dụ: [{ month: 'T1', revenue: 15000000 }, ...]
    luotDatTheoThang: Array<{ thang: string; luotDat: number }> // Lượt đặt sân từng tháng, ví dụ: [{ month: 'T1', bookings: 120 }, ...]
    tiLeSuDungSan: Array<{ san: string; tiLeSuDung: number }> // Tỷ lệ sử dụng từng sân, ví dụ: [{ field: 'Sân số 1', usage: 85 }, ...]
    tongDoanhThu: number // Tổng doanh thu
    tongLuotDat: number // Tổng lượt đặt sân
    tiLeSuDungTrungBinh: number // Tỷ lệ sử dụng trung bình (%)
    khachHangMoi: number // Số khách hàng mới
    phanTramTangTruongDoanhThu: number // % tăng/giảm doanh thu so với kỳ trước
    phanTramTangTruongLuotDat: number // % tăng/giảm lượt đặt so với kỳ trước
    phanTramTangTruongSuDung: number // % tăng/giảm tỷ lệ sử dụng so với kỳ trước
    phanTramTangTruongKhachHangMoi: number // % tăng/giảm khách hàng mới so với kỳ trước
}

const ReportContent = () => {
    const [dateRange, setDateRange] = useState<'quarter' | 'year'>('year')
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const yearOptions = [
        { label: '2023', value: 2023 },
        { label: '2024', value: 2024 },
        { label: '2025', value: 2025 },
    ]

    // Chỉ cho phép chọn quý hoặc năm
    const dateRangeOptions = [
        { label: 'Quý này', value: 'quarter' },
        { label: 'Năm nay', value: 'year' },
    ]

    // Gọi API lấy dashboard report
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-report', dateRange, year],
        queryFn: () =>
            timeSlotsService.getDashboardReportByChuSan({
                range: dateRange,
                year,
            }),
    })

    // Log raw data để debug
    console.log('Dashboard raw data:', data)

    // Nếu chưa có data thì dùng mảng rỗng để tránh lỗi
    const doanhThuTheoThang = data?.doanhThuTheoThang || []
    const luotDatTheoThang = data?.luotDatTheoThang || []
    const tiLeSuDungSan = data?.tiLeSuDungSan || []
    const tongDoanhThu = data?.tongDoanhThu || 0
    const tongLuotDat = data?.tongLuotDat || 0
    const tiLeSuDungTrungBinh = data?.tiLeSuDungTrungBinh || 0
    const khachHangMoi = data?.khachHangMoi || 0
    const phanTramTangTruongDoanhThu = data?.phanTramTangTruongDoanhThu || 0
    const phanTramTangTruongLuotDat = data?.phanTramTangTruongLuotDat || 0
    const phanTramTangTruongSuDung = data?.phanTramTangTruongSuDung || 0
    const phanTramTangTruongKhachHangMoi = data?.phanTramTangTruongKhachHangMoi || 0

    // Đặt sau khi đã lấy doanhThuTheoThang, luotDatTheoThang mới nhất
    const maxRevenue =
        doanhThuTheoThang.length > 0 &&
        doanhThuTheoThang.some((item: { doanhThu: number }) => item.doanhThu > 0)
            ? Math.max(
                  ...doanhThuTheoThang.map((item: { doanhThu: number }) => item.doanhThu)
              )
            : 1

    const maxBookings =
        luotDatTheoThang.length > 0 &&
        luotDatTheoThang.some((item: { luotDat: number }) => item.luotDat > 0)
            ? Math.max(
                  ...luotDatTheoThang.map((item: { luotDat: number }) => item.luotDat)
              )
            : 1

    return (
        <div className={styles.report_content}>
            <div className={styles.header}>
                <h1 className={styles.title}>Báo cáo thống kê</h1>
                <div className={styles.actions}>
                    <div className={styles.date_selector}>
                        <Select
                            className={styles.date_range_select}
                            value={dateRange}
                            options={dateRangeOptions}
                            onChange={(value) =>
                                setDateRange(value as 'quarter' | 'year')
                            }
                            style={{ width: 140 }}
                        />
                        <Select
                            className={styles.year_select}
                            value={year}
                            options={yearOptions}
                            onChange={(value) => setYear(Number(value))}
                            style={{ width: 120 }}
                            // disabled={dateRange !== 'year'}
                        />
                    </div>
                    {/* <button className={styles.download_button}>
                        <Download size={16} />
                        <span>Xuất báo cáo</span>
                    </button> */}
                </div>
            </div>

            <div className={styles.summary_cards}>
                <div className={styles.summary_card}>
                    <div className={styles.card_icon}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.card_content}>
                        <h3 className={styles.card_title}>Tổng doanh thu</h3>
                        <p className={styles.card_value}>
                            {tongDoanhThu.toLocaleString('vi-VN')} đ
                        </p>
                        <p className={styles.card_change}>
                            <TrendingUp size={14} />
                            <span>
                                {phanTramTangTruongDoanhThu >= 0 ? '+' : ''}
                                {phanTramTangTruongDoanhThu}% so với kỳ trước
                            </span>
                        </p>
                    </div>
                </div>

                <div className={styles.summary_card}>
                    <div className={styles.card_icon}>
                        <Calendar size={24} />
                    </div>
                    <div className={styles.card_content}>
                        <h3 className={styles.card_title}>Tổng lượt đặt sân</h3>
                        <p className={styles.card_value}>{tongLuotDat}</p>
                        <p className={styles.card_change}>
                            <TrendingUp size={14} />
                            <span>
                                {phanTramTangTruongLuotDat >= 0 ? '+' : ''}
                                {phanTramTangTruongLuotDat}% so với kỳ trước
                            </span>
                        </p>
                    </div>
                </div>

                <div className={styles.summary_card}>
                    <div className={styles.card_icon}>
                        <BarChart2 size={24} />
                    </div>
                    <div className={styles.card_content}>
                        <h3 className={styles.card_title}>Tỷ lệ sử dụng sân</h3>
                        <p className={styles.card_value}>
                            {tiLeSuDungTrungBinh.toFixed(1)}%
                        </p>
                        <p className={styles.card_change}>
                            <TrendingUp size={14} />
                            <span>
                                {phanTramTangTruongSuDung >= 0 ? '+' : ''}
                                {phanTramTangTruongSuDung}% so với kỳ trước
                            </span>
                        </p>
                    </div>
                </div>

                <div className={styles.summary_card}>
                    <div className={styles.card_icon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.card_content}>
                        <h3 className={styles.card_title}>Khách hàng mới</h3>
                        <p className={styles.card_value}>{khachHangMoi}</p>
                        <p className={styles.card_change}>
                            <TrendingUp size={14} />
                            <span>
                                {phanTramTangTruongKhachHangMoi >= 0 ? '+' : ''}
                                {phanTramTangTruongKhachHangMoi}% so với kỳ trước
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className={styles.charts_container}>
                <div className={styles.chart_card}>
                    <div className={styles.chart_header}>
                        <h3 className={styles.chart_title}>
                            Doanh thu theo tháng
                        </h3>
                    </div>
                    <div className={styles.chart}>
                        <div className={styles.chart_bars}>
                            {isLoading ? (
                                <div>Đang tải dữ liệu...</div>
                            ) : (
                                doanhThuTheoThang.map(
                                    (
                                        item: { thang: string; doanhThu: number },
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className={styles.chart_bar_container}
                                        >
                                            <div
                                                className={styles.chart_bar}
                                                style={{
                                                    height: `${(item.doanhThu / maxRevenue) * 100}%`,
                                                }}
                                            >
                                                <span className={styles.bar_value}>
                                                    {(item.doanhThu / 1000000).toFixed(1)}M
                                                </span>
                                            </div>
                                            <span className={styles.bar_label}>
                                                {item.thang}
                                            </span>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.chart_card}>
                    <div className={styles.chart_header}>
                        <h3 className={styles.chart_title}>
                            Lượt đặt sân theo tháng
                        </h3>
                    </div>
                    <div className={styles.chart}>
                        <div className={styles.chart_bars}>
                            {isLoading ? (
                                <div>Đang tải dữ liệu...</div>
                            ) : (
                                luotDatTheoThang.map(
                                    (
                                        item: { thang: string; luotDat: number },
                                        index: number
                                    ) => (
                                        <div
                                            key={index}
                                            className={styles.chart_bar_container}
                                        >
                                            <div
                                                className={`${styles.chart_bar} ${styles.booking_bar}`}
                                                style={{
                                                    height: `${(item.luotDat / maxBookings) * 100}%`,
                                                }}
                                            >
                                                <span className={styles.bar_value}>
                                                    {item.luotDat}
                                                </span>
                                            </div>
                                            <span className={styles.bar_label}>
                                                {item.thang}
                                            </span>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.usage_chart_container}>
                <div className={styles.chart_card}>
                    <div className={styles.chart_header}>
                        <h3 className={styles.chart_title}>
                            Tỷ lệ sử dụng theo sân
                        </h3>
                    </div>
                    <div className={styles.usage_chart}>
                        {isLoading ? (
                            <div>Đang tải dữ liệu...</div>
                        ) : (
                            tiLeSuDungSan.map(
                                (
                                    item: { san: string; tiLeSuDung: number },
                                    index: number
                                ) => (
                                    <div
                                        key={index}
                                        className={styles.usage_item}
                                    >
                                        <div className={styles.usage_info}>
                                            <span className={styles.usage_label}>
                                                {item.san}
                                            </span>
                                            <span className={styles.usage_value}>
                                                {item.tiLeSuDung}%
                                            </span>
                                        </div>
                                        <div className={styles.usage_bar_container}>
                                            <div
                                                className={styles.usage_bar}
                                                style={{
                                                    width: `${item.tiLeSuDung}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportContent
