/*
 * # -*- coding: utf-8 -*-
 * # Copyright (C) 2025 NH11
 * #
 * # All rights reserved.
 * # @link
 * #
 */

import validator from 'validator'

class ValidateServices {
    validateName(name: string): boolean {
        const options = {
            min: 0,
            max: 255,
        }

        const vietnameseRegex =
            /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯưẠ-ỹ\s]+$/u

        return vietnameseRegex.test(name) && validator.isLength(name, options)
    }
    validateEmail(email: string): boolean {
        const options = {
            min: 0,
            max: 150,
        }
        return validator.isEmail(email) && validator.isLength(email, options)
    }

    validatePassword(password: string): boolean {
        const options = {
            minLength: 8,
            maxLength: 128,
            minLowercase: 0,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0,
        }

        const hasLetter = /[a-zA-Z]/.test(password)

        return validator.isStrongPassword(password, options) && hasLetter
    }

    validateURL(url: string): boolean {
        // Check if the URL is valid and starts with "https://"
        return validator.isURL(url) && url.startsWith('https://')
    }

    validateLength(value: string, min: number, max: number): boolean {
        return validator.isLength(value, { min, max })
    }

    validateMinLength(value: string, min: number): boolean {
        return validator.isLength(value, { min })
    }

    validateMaxLength(value: string, max: number): boolean {
        return validator.isLength(value, { max })
    }

    validatePhoneNumber(phone: string): boolean {
        const phoneRegex =
            /^(?:\+84|0)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/
        return phoneRegex.test(phone)
    }

    // Add more validation methods as needed
}

export const ValidateService = new ValidateServices()
