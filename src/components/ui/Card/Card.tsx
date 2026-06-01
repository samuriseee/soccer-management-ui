/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import styles from './Card.module.scss'
import Image, { type StaticImageData } from 'next/image'

interface IProps {
    imageSrc: StaticImageData
    iconsrc: StaticImageData
    title: string
    origin: string
    type: string
}
const Card: React.FC<IProps> = ({ imageSrc, iconsrc, title, origin, type }) => {
    return (
        <div className={`${styles.card_wrap} rounded-md shadow-sm bg-white`}> 
            <div className={styles.image_area}>
                <Image src={imageSrc} alt="Card Content 1" />
            </div>
            <div className={styles.card_body}>
                <div className={styles.heading_area}>
                    <div className={styles.origin_area}>
                        <span>
                            <Image src={iconsrc} alt="Card Icon" />
                        </span>
                        <span>{origin}</span>
                    </div>
                    <span>{title}</span>
                </div>

                <div className={styles.type_area}>
                    <span>{type}</span>
                </div>
            </div>
        </div>
    )
}
export default Card
