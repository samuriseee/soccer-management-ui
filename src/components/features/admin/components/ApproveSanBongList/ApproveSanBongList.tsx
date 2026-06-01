/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useState, useRef, useEffect } from 'react'
import styles from './ApproveSanBongList.module.scss'
import Button from '@/components/ui/Button/Button'
import ViewDetailModal from '../ViewDetailModal/ViewDetailModal'
import { useQuery, useMutation } from '@tanstack/react-query'
import { adminService } from '@/core/services/API/Admin/Admin.service'
import Input from '@/components/ui/TextField/TextField'
import { useDebounce } from '@/hooks/useDebounce'
import Select from '@/components/ui/Select/Select'
import { Search } from 'lucide-react'
import { danangAddress } from '@/data/danangAddress'
import Pagination from '@/components/ui/Pagination/Pagination'
import { showMessage } from '@/components/ui/Notification/Notification'
import ModalConfirm from '@/components/features/home/ModalConfirm'

const PAGE_SIZE = 12

const ApproveSanBongList = () => {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [districts] = useState(
        danangAddress[0].Districts.map((district: any) => ({
            label: district.Name,
            value: district.Name,
        }))
    )
    const [wards, setWards] = useState<{ label: string; value: string }[]>([])
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
        null
    )
    const [selectedWard, setSelectedWard] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [approvingId, setApprovingId] = useState<string | null>(null)
    const [disablingId, setDisablingId] = useState<string | null>(null)

    // State cho modal confirm duyệt sân
    const [confirmModal, setConfirmModal] = useState<{ open: boolean; id?: string; type?: 'approve' | 'disable' }>({ open: false })

    // Sử dụng useDebounce dạng function cho onChange
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const debounceSearchFn = useDebounce((value: string) => {
        setDebouncedSearch(value)
    }, 400)

    const handleSearchChange = (e: any) => {
        setSearch(e.target.value)
        debounceSearchFn(e.target.value)
    }

    const handleDistrictChange = (districtName: string) => {
        setSelectedDistrict(districtName)
        const selectedDistrictData = danangAddress[0].Districts.find(
            (district: any) => district.Name === districtName
        )
        if (selectedDistrictData) {
            setWards(
                selectedDistrictData.Wards.map((ward: any) => ({
                    label: ward.Name || '',
                    value: ward.Name || '',
                }))
            )
        } else {
            setWards([])
        }
        setSelectedWard(null)
    }

    const handleWardChange = (wardName: string) => {
        setSelectedWard(wardName)
    }

    // Khi filter/search đổi, reset về page 1
    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, statusFilter, selectedDistrict, selectedWard])

    const { data, isLoading, isFetching, refetch } = useQuery({
        queryKey: [
            'admin-sanbong-list',
            debouncedSearch,
            statusFilter,
            selectedDistrict,
            selectedWard,
            currentPage,
        ],
        queryFn: async () =>
            adminService.getAllSanBongForAdmin({
                search: debouncedSearch || undefined,
                daDuyet:
                    statusFilter === 'all'
                        ? undefined
                        : statusFilter === 'true'
                          ? 'true'
                          : statusFilter === 'false'
                            ? 'false'
                            : undefined,
                quanHuyen: selectedDistrict || undefined,
                phuongXa: selectedWard || undefined,
                page: currentPage,
                limit: PAGE_SIZE,
            }),
    })

    const {mutate: approveMutation} = useMutation({
        mutationFn: (maSanBong: string) => adminService.approveSanBong(maSanBong),
        onMutate: (maSanBong) => setApprovingId(maSanBong),
        onSuccess: () => {
            showMessage('success', 'Duyệt sân thành công!')
            setConfirmModal({ open: false })
            refetch()
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Duyệt sân thất bại!'
            showMessage('error', errorMessage)
            setConfirmModal({ open: false })
        },
        onSettled: () => setApprovingId(null),
    })

    const {mutate: disableMutation} = useMutation({
        mutationFn: (maSanBong: string) => adminService.disiableSanBong(maSanBong),
        onMutate: (maSanBong) => setDisablingId(maSanBong),
        onSuccess: () => {
            showMessage('success', 'Vô hiệu hóa sân bóng thành công!')
            setConfirmModal({ open: false })
            refetch()
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.message || 'Vô hiệu hóa sân bóng thất bại!'
            showMessage('error', errorMessage)
            setConfirmModal({ open: false })
        },
        onSettled: () => setDisablingId(null),
    })

    const [selectedSan, setSelectedSan] = useState<any>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleViewDetail = (san: any) => {
        setSelectedSan(san)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setSelectedSan(null)
    }

    const sanBongList = data?.data || []
    const total = data?.total || 0

    const handleOpenApproveConfirm = (maSanBong: string) => {
        setConfirmModal({ open: true, id: maSanBong, type: 'approve' })
    }
    const handleOpenDisableConfirm = (maSanBong: string) => {
        setConfirmModal({ open: true, id: maSanBong, type: 'disable' })
    }
    const handleCloseApproveConfirm = () => {
        setConfirmModal({ open: false })
    }
    const handleConfirmApproveOrDisable = async () => {
        if (confirmModal.id) {
            if (confirmModal.type === 'approve') {
                approveMutation(confirmModal.id)
            } else if (confirmModal.type === 'disable') {
                disableMutation(confirmModal.id)
            }
        }
    }

    return (
        <div className={styles.approve_sanbong_list}>
            <h2 className={styles.title}>Danh sách sân bóng chờ duyệt</h2>
            <div className={styles.filter_row}>
                <Input
                    className={styles.filter_input}
                    placeholder="Tìm kiếm tên sân..."
                    value={search}
                    onChange={handleSearchChange}
                    allowClear
                    onPressEnter={() => refetch()}
                    prefix={<Search size={18} className={styles.search_icon} />}
                />
                <Select
                    className={styles.filter_select}
                    placeholder="Chọn quận/huyện"
                    options={districts}
                    onChange={handleDistrictChange}
                    value={selectedDistrict || undefined}
                    style={{ width: 160 }}
                    allowClear
                />
                <Select
                    className={styles.filter_select}
                    placeholder="Chọn phường/xã"
                    options={wards}
                    onChange={handleWardChange}
                    value={selectedWard || undefined}
                    style={{ width: 160 }}
                    allowClear
                    disabled={!selectedDistrict}
                />
                <Select
                    className={styles.filter_select}
                    placeholder="Trạng thái"
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value)}
                    style={{ width: 140 }}
                    allowClear={false}
                >
                    <Select.Option value="all">Tất cả</Select.Option>
                    <Select.Option value="true">Đã duyệt</Select.Option>
                    <Select.Option value="false">Chưa duyệt</Select.Option>
                </Select>
            </div>
            <div className={styles.table_container}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tên sân</th>
                            <th>Chủ sân</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading || isFetching ? (
                            <tr>
                                <td colSpan={6} className={styles.no_data}>
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : sanBongList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className={styles.no_data}>
                                    Không có sân bóng nào chờ duyệt
                                </td>
                            </tr>
                        ) : (
                            sanBongList.map((san: any) => (
                                <tr key={san.maSanBong}>
                                    <td>{san.tenSan}</td>
                                    <td>{san.chuSanHoTen}</td>
                                    <td>{san.chuSanEmail}</td>
                                    <td>{san.chuSanSoDienThoai}</td>
                                    <td>
                                        <span
                                            className={
                                                san.daBiDisable
                                                    ? styles.status_disabled
                                                    : san.daDuyet
                                                        ? styles.status_approved
                                                        : styles.status_pending
                                            }
                                        >
                                            {san.daBiDisable
                                                ? 'Vô hiệu hóa'
                                                : san.daDuyet
                                                    ? 'Đã duyệt'
                                                    : 'Chưa duyệt'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.action_buttons}>
                                            <Button
                                                type="default"
                                                size="small"
                                                onClick={() => handleViewDetail(san)}
                                            >
                                                Xem chi tiết
                                            </Button>
                                            <Button
                                                type="primary"
                                                size="small"
                                                disabled={san.daDuyet || approvingId === san.maSanBong}
                                                onClick={() => handleOpenApproveConfirm(san.maSanBong)}
                                            >
                                                Duyệt sân
                                            </Button>
                                            <Button
                                                type="default"
                                                size="small"
                                                className={styles.disable_btn}
                                                onClick={() => handleOpenDisableConfirm(san.maSanBong)}
                                                disabled={san.daBiDisable}
                                            >
                                                Vô hiệu hóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className={styles.pagination_right}>
                    <Pagination
                        size="small"
                        current={currentPage}
                        pageSize={PAGE_SIZE}
                        total={total}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                    />
                </div>
            </div>
            <ViewDetailModal
                open={modalOpen}
                onClose={handleCloseModal}
                sanBong={selectedSan}
            />
            <ModalConfirm
                open={confirmModal.open}
                onCancel={handleCloseApproveConfirm}
                onClickConfirm={handleConfirmApproveOrDisable}
                title={confirmModal.type === 'disable' ? 'Xác nhận vô hiệu hóa sân bóng' : 'Xác nhận duyệt sân bóng'}
                description={confirmModal.type === 'disable' ? 'Bạn có chắc chắn muốn vô hiệu hóa sân bóng này?' : 'Bạn có chắc chắn muốn duyệt sân bóng này?'}
                loading={confirmModal.type === 'disable' ? disablingId === confirmModal.id : approvingId === confirmModal.id}
            />
        </div>
    )
}

export default ApproveSanBongList
