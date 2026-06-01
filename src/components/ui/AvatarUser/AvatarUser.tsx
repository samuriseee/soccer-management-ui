/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import React, { useEffect, useState } from 'react'
import Avatar from '../Avatar/Avatar'
import styles from './AvatarUser.module.scss'
import clsx from 'clsx'
import { getInitials } from '@/helper/utils'

interface UserInfo {
    hoTen: string
    avatar?: string
}
interface AvatarUserProps {
    userInfo: UserInfo
    classNameAvatar?: string
    size?: 24 | 32 | 36 | 40 | 44 | 48 | 50 | 52 | 60 | 90 | 120 | 200
}

const AvatarUser: React.FC<AvatarUserProps> = ({
    userInfo,
    classNameAvatar,
    size = 44,
    ...rest
}) => {
    // const [firstCharName, setFirstCharName] = useState<string>(
    //     getInitials(userInfo.hoTen, '')
    // )

    // useEffect(() => {
    //     setFirstCharName(getInitials(userInfo.hoTen, ''))
    // }, [userInfo])
    const firstCharName = getInitials(userInfo?.hoTen, '')

    return (
        <Avatar
            size={size}
            className={clsx(classNameAvatar ?? '', {
                [styles.no_avatar]: !(userInfo?.avatar && userInfo.avatar !== ''),
            }, 'rounded-full')}
            src={userInfo?.avatar && userInfo.avatar !== '' ? userInfo.avatar : undefined}
        >
            {userInfo?.avatar && userInfo.avatar !== '' ? null : (
                <span className="text-white font-semibold">{firstCharName}</span>
            )}
        </Avatar>
    )
}

export default AvatarUser
