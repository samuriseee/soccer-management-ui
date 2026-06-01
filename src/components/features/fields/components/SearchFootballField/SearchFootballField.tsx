/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useEffect, useState } from 'react'
import styles from './SearchFootballField.module.scss'
import Input from '@/components/ui/TextField/TextField'
import { Search } from 'lucide-react'
import Select from '@/components/ui/Select/Select'
import { danangAddress } from '@/data/danangAddress'
import Button from '@/components/ui/Button/Button'

interface Ward {
    Id?: string
    Name?: string
    Level: string
}

interface District {
    Id: string
    Name: string
    Wards: Ward[]
}

interface SelectOption {
    label: string
    value: string
    code?: string
}

interface SearchFootballFieldProps {
    search?: string
    selectedDistrict?: string | null
    selectedWard?: string | null
    onSearch?: (params: {
        search?: string
        selectedDistrict?: string | null
        selectedWard?: string | null
        kinhDo?: number
        viDo?: number
        trigger?: 'search' | 'nearby' | 'district' | 'ward'
    }) => void
}

const SearchFootballField: React.FC<SearchFootballFieldProps> = ({
    search = '',
    selectedDistrict = null,
    selectedWard = null,
    onSearch,
}) => {
    const [districts, setDistricts] = useState<SelectOption[]>([])
    const [wards, setWards] = useState<SelectOption[]>([])
    const [searchValue, setSearchValue] = useState(search)
    const [district, setDistrict] = useState<string | null>(selectedDistrict)
    const [ward, setWard] = useState<string | null>(selectedWard)

    useEffect(() => {
        const districtOptions = danangAddress[0].Districts.map(
            (district: District) => ({
                label: district.Name,
                value: district.Name,
            })
        )
        setDistricts(districtOptions)
    }, [])

    // Đồng bộ giá trị select khi prop selectedDistrict/selectedWard thay đổi (ví dụ khi đọc từ URL param)
    useEffect(() => {
        setDistrict(selectedDistrict)
    }, [selectedDistrict])

    useEffect(() => {
        setWard(selectedWard)
    }, [selectedWard])

    useEffect(() => {
        if (district) {
            const selectedDistrictData = danangAddress[0].Districts.find(
                (d: District) => d.Name === district
            )
            if (selectedDistrictData) {
                const wardOptions = selectedDistrictData.Wards.map(
                    (ward: Ward) => ({
                        label: ward.Name || '',
                        value: ward.Name || '',
                    })
                )
                setWards(wardOptions)
            } else {
                setWards([])
            }
        } else {
            setWards([])
        }
    }, [district])

    // Đồng bộ giá trị input khi prop search thay đổi (ví dụ khi đọc từ URL param)
    useEffect(() => {
        setSearchValue(search)
    }, [search])

    const handleSearchButton = () => {
        onSearch?.({
            search: searchValue,
            selectedDistrict: district,
            selectedWard: ward,
            trigger: 'search',
        })
    }

    // Khi chọn quận/huyện
    const handleDistrictChange = (value: string | null) => {
        setDistrict(value)
        setWard(null)
        onSearch?.({
            search: searchValue,
            selectedDistrict: value,
            selectedWard: null,
            trigger: 'district',
        })
    }

    // Khi chọn phường/xã
    const handleWardChange = (value: string | null) => {
        setWard(value)
        onSearch?.({
            search: searchValue,
            selectedDistrict: district,
            selectedWard: value,
            trigger: 'ward',
        })
    }

    // Khi click "Sân bóng gần đây"
    const handleNearby = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { longitude, latitude } = pos.coords
                    onSearch?.({
                        search: searchValue,
                        selectedDistrict: district,
                        selectedWard: ward,
                        kinhDo: longitude,
                        viDo: latitude,
                        trigger: 'nearby',
                    })
                },
                () => {
                    alert('Không thể lấy vị trí của bạn. Vui lòng bật định vị!')
                }
            )
        } else {
            alert('Trình duyệt không hỗ trợ định vị vị trí!')
        }
    }

    return (
        <div className={styles.search_container}>
            <div className={styles.row}>
                <Input
                    placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                    prefix={<Search size={18} className={styles.search_icon} />}
                    className={styles.search_input}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onPressEnter={e => {
                        e.preventDefault?.()
                        handleSearchButton()
                    }}
                />
                <Button
                    shape="square"
                    type="default"
                    onClick={handleNearby}
                    className={styles.nearby_button}
                >
                    Sân bóng gần đây
                </Button>
            </div>
            <div className={styles.row}>
                <Select
                    className={styles.select_district}
                    placeholder="Chọn quận/huyện"
                    options={districts}
                    onChange={handleDistrictChange}
                    value={district || undefined}
                    allowClear
                />
                <Select
                    className={styles.select_ward}
                    placeholder="Chọn phường/xã"
                    options={wards}
                    onChange={handleWardChange}
                    value={ward || undefined}
                    disabled={!district}
                    allowClear
                />
                <Button
                    shape="square"
                    type="primary"
                    onClick={handleSearchButton}
                    className={styles.search_button}
                >
                    Tìm kiếm
                </Button>
            </div>
        </div>
    )
}

export default SearchFootballField
