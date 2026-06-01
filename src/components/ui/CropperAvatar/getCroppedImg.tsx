/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = new Image()
    image.src = imageSrc

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    await new Promise((resolve) => {
        image.onload = resolve
    })

    ctx?.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    )

    return new Promise<string>((resolve, reject) => {
        const base64Image = canvas.toDataURL('image/jpeg')
        resolve(base64Image)
    })
}

export default getCroppedImg
