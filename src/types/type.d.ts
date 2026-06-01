/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

interface IUser {
    id: string // Added missing field
    ho: string
    ten: string
    gioiTinh: 'male' | 'female' | 'other'
    soDienThoai?: string
    ngaySinh: string
    avatar: string
    quocGia?: string
    thanhPho?: string
    diaChi?: string
    canhBaoThietBi: boolean
    daDatMatKhau?: boolean
    email: string
    vaiTro: 'chuSan' | 'nguoiThue' | 'admin'
}
interface IMenuItem {
    key: string
    label: string
    href: string
    children?: { key: string; label: string; href: string }[]
}
interface IHeaderMenu {
    [key: string]: IMenuItem[]
}
interface IDropdownMenu {
    [key: string]: MenuProps['items']
}

declare module '*.html' {
    const content: string
    export default content
}
