/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import Image from 'next/image'

interface LogoProps {
    onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ onClick }) => {
    return (
        <div className="cursor-pointer w-[156px] h-[60px]" onClick={onClick}>
            <Image
                src="/images/logo.png"
                alt="header"
                width={156}
                height={60}
                // style={{ width: 'auto', height: 'auto' }}
                className="w-full h-full object-contain"
            />
        </div>
    )
}

export default Logo
