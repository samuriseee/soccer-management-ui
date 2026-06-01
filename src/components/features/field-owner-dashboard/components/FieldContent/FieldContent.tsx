/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import styles from './FieldContent.module.scss'
import Button from '@/components/ui/Button/Button'
import Select from '@/components/ui/Select/Select'
import AddEditFieldModal from './AddEditFieldModal/AddEditFieldModal'
import Input from '@/components/ui/TextField/TextField'
import OwnerFieldCard from './OwnerFieldCard/OwnerFieldCard'
import ModalConfirm from '@/components/features/home/ModalConfirm'
import {
    queryOptions,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import { subFootballFieldService } from '@/core/services/API/SubFootballField/SubFootballField.service'
import { fooballFieldInfoService } from '@/core/services/API/FootballFieldInfo/FootballFieldInfo.service'
import { useDebounce } from '@/hooks/useDebounce'
import { showMessage } from '@/components/ui/Notification/Notification'
import { FieldDetailFromApi, FieldFormData } from './types/field'
import { useFieldTypes } from '@/hooks/useFieldTypes'

const FieldContent = () => {
    const queryClient = useQueryClient()
    const containerRef = useRef<HTMLDivElement>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [fieldTypeFilter, setFieldTypeFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [editingField, setEditingField] = useState<FieldDetailFromApi | null>(
        null
    )

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm)

    const updateSearchTerm = useDebounce((value: string) => {
        setDebouncedSearchTerm(value)
    }, 300)

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        updateSearchTerm(e.target.value)
    }

    const { data: fieldTypes, isLoading: isLoadingFieldTypes } = useFieldTypes()

    const {
        data: dataSanBong,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['san-bong-info'],
        queryFn: () => fooballFieldInfoService.getFootballFieldInfo(),
    })

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
        useInfiniteQuery({
            queryKey: [
                'subFootballFields',
                debouncedSearchTerm,
                fieldTypeFilter,
            ],
            queryFn: async ({ pageParam = 1 }) =>
                subFootballFieldService.getAllSubFootballField(
                    dataSanBong.maSanBong,
                    {
                        tenSanChiTiet: debouncedSearchTerm,
                        maLoaiSan:
                            fieldTypeFilter === 'all'
                                ? undefined
                                : fieldTypeFilter,
                        page: pageParam,
                        limit: 8,
                    }
                ),
            enabled: !!dataSanBong?.maSanBong,
            getNextPageParam: (lastPage) => {
                const currentPage = lastPage.page
                const totalPage = lastPage.totalPage
                return currentPage < totalPage ? currentPage + 1 : undefined
            },
            initialPageParam: 1,
        })

    useEffect(() => {
        const container = containerRef.current
        if (!container) return
        const handleScroll = () => {
            const isBottom =
                container.scrollHeight - container.scrollTop <=
                container.clientHeight + 1
            if (isBottom && hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
            }
        }
        container.addEventListener('scroll', handleScroll)
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            }
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage])

    const fields = data?.pages.flatMap((page) => page.data) || []

    const { mutate: createSubFieldMuation, isPending: isCreating } = useMutation({
        mutationFn: async ({
            maSanBong,
            data,
        }: {
            maSanBong: string
            data: ICreateSubFootballFieldRequest
        }) => {
            return await subFootballFieldService.createSubFootballField(
                maSanBong,
                data
            )
        },
        onSuccess: () => {
            showMessage('success', 'Tạo sân bóng thành công!')
            refetch()
            setIsModalOpen(false)
        },
        onError: (error: any) => {
            console.error('Lỗi tạo sân bóng:', error)
            const errorMessage =
                error?.response?.data?.message || 'Lỗi khi tạo sân bóng.'
            showMessage('error', errorMessage)
        },
    })

    const { mutate: updateSubFieldMutation, isPending: isUpdating } =
        useMutation({
            mutationFn: async ({
                maSanChiTiet,
                data,
            }: {
                maSanChiTiet: string
                data: FieldFormData
            }) => {
                const dataToUpdate: IUpdateSubFootballFieldRequest = {
                    tenSanChiTiet: data.tenSanChiTiet,
                    maLoaiSan: data.maLoaiSan,
                    giaThueBuoiSang: data.giaThueBuoiSang,
                    giaThueBuoiToi: data.giaThueBuoiToi,
                    hinhAnh: data.hinhAnh || undefined,
                }
                return await subFootballFieldService.updateSubFootballField(
                    maSanChiTiet,
                    dataToUpdate
                )
            },
            onSuccess: () => {
                showMessage('success', 'Cập nhật sân bóng thành công!')
                refetch()
                setIsModalOpen(false)
                setEditingField(null)
                setSelectedFieldId(null)
            },
            onError: (error: any) => {
                console.error('Lỗi cập nhật sân bóng:', error)
                const errorMessage =
                    error?.response?.data?.message ||
                    'Lỗi khi cập nhật sân bóng.'
                showMessage('error', errorMessage)
            },
        })

    const { mutate: deleteSubFieldMutation, isPending: isDeleting } =
        useMutation({
            mutationFn: async (maSanChiTiet: string) => {
                return await subFootballFieldService.deleteSubFootballField(
                    maSanChiTiet
                )
            },
            onSuccess: () => {
                showMessage('success', 'Xóa sân thành công!')
                refetch()
                setIsDeleteModalOpen(false)
                setFieldToDelete('')
            },
            onError: (error: any) => {
                console.error('Lỗi xoá sân:', error)
                const errorMessage =
                    error?.response?.data?.message || 'Lỗi khi xóa sân.'
                showMessage('error', errorMessage)
                setIsDeleteModalOpen(false)
            },
        })

    const {
        data: fetchedFieldDetail,
        refetch: refetchFieldDetail,
        isFetching: isFetchingFieldDetail,
    } = useQuery({
        queryKey: ['sub-field-detail', selectedFieldId],
        queryFn: () =>
            subFootballFieldService.getOneSubFootballField(selectedFieldId!),
        enabled: !!selectedFieldId,
    })

    useEffect(() => {
        if (fetchedFieldDetail && !isFetchingFieldDetail) {
            setEditingField(fetchedFieldDetail)
            setIsModalOpen(true)
        }
    }, [fetchedFieldDetail, isFetchingFieldDetail])

    useEffect(() => {
        if (selectedFieldId) {
            refetchFieldDetail()
        }
    }, [selectedFieldId])

    // State cho modal xác nhận xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [fieldToDelete, setFieldToDelete] = useState<string>('')

    const handleAddField = () => {
        setEditingField(null)
        setIsModalOpen(true)
    }

    const handleEditField = (maSanChiTiet: string) => {
        setSelectedFieldId(maSanChiTiet)
    }

    // Mở modal xác nhận xóa
    const handleOpenDeleteModal = (maSanChiTiet: string) => {
        setFieldToDelete(maSanChiTiet)
        setIsDeleteModalOpen(true)
    }

    // Xử lý xóa sân sau khi xác nhận
    const handleConfirmDelete = () => {
        if (fieldToDelete) {
            deleteSubFieldMutation(fieldToDelete)
        }
    }

    const handleSaveField = (fieldData: FieldFormData) => {
        if (!editingField) {
            if (fieldData.hinhAnh instanceof File) {
                createSubFieldMuation({
                    maSanBong: dataSanBong.maSanBong,
                    data: {
                        tenSanChiTiet: fieldData.tenSanChiTiet,
                        maLoaiSan: fieldData.maLoaiSan,
                        giaThueBuoiSang: fieldData.giaThueBuoiSang,
                        giaThueBuoiToi: fieldData.giaThueBuoiToi,
                        hinhAnh: fieldData.hinhAnh,
                    },
                })
            } else {
                showMessage('error', 'Vui lòng chọn ảnh hợp lệ để tạo sân mới')
            }
        } else {
            updateSubFieldMutation({
                maSanChiTiet: editingField.maSanChiTiet,
                data: fieldData,
            })
        }
    }

    return (
        <div className={styles.field_content}>
            <div className={styles.header}>
                <h1 className={styles.title}>Quản lý sân bóng chi tiết</h1>
                <Button
                    type="primary"
                    shape="square"
                    className={styles.add_button}
                    onClick={handleAddField}
                >
                    <Plus size={16} />
                    Thêm sân mới
                </Button>
            </div>

            <div className={styles.filters}>
                <div className={styles.search_container}>
                    <Input
                        placeholder="Tìm kiếm theo tên sân..."
                        className={styles.search_input}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        prefix={
                            <Search size={18} className={styles.search_icon} />
                        }
                    />
                </div>
                <div className={styles.filter_container}>
                    <Select
                        className={styles.filter_select}
                        value={fieldTypeFilter}
                        onChange={(value) => setFieldTypeFilter(value)}
                    >
                        <Select.Option value="all">
                            Tất cả loại sân
                        </Select.Option>
                        {fieldTypes?.map((type: any) => (
                            <Select.Option
                                key={type.maLoaiSan}
                                value={type.maLoaiSan}
                            >
                                {type.tenLoaiSan}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className={styles.fields_grid} ref={containerRef}>
                {fields.length > 0 ? (
                    fields.map((field) => (
                        <OwnerFieldCard
                            key={field.maSanChiTiet}
                            maSanChiTiet={field.maSanChiTiet}
                            tenSanChiTiet={field.tenSanChiTiet}
                            tenLoaiSan={field.tenLoaiSan}
                            giaThueBuoiSang={field.giaThueBuoiSang}
                            giaThueBuoiToi={field.giaThueBuoiToi}
                            hinhAnh={field.media[0]}
                            onEdit={() => handleEditField(field.maSanChiTiet)}
                            onDelete={() =>
                                handleOpenDeleteModal(field.maSanChiTiet)
                            }
                        />
                    ))
                ) : (
                    <div className={styles.no_data}>
                        <p>Không tìm thấy sân bóng nào</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <AddEditFieldModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveField}
                    fieldData={editingField}
                    fieldTypes={fieldTypes}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            )}

            <ModalConfirm
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onClickConfirm={handleConfirmDelete}
                title="Xác nhận xóa sân"
                description="Bạn có chắc chắn muốn xóa sân này không? Hành động này không thể hoàn tác."
            />
        </div>
    )
}

export default FieldContent
