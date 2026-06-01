/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    DEFAULT: 'var(--background-white-default)',
                    brand: 'var(--background-color-brand)',
                    gray: 'var(--background-gray-default)',
                    soft: 'var(--background-soft-blue)',
                },
                text: {
                    DEFAULT: 'var(--text-color-primary)',
                    brand: 'var(--text-color-brand)',
                    secondary: 'var(--text-color-secondary)',
                },
                border: {
                    DEFAULT: 'var(--border-color-default)',
                },
                primary: 'var(--text-color-brand)',
            },
            borderRadius: {
                xs: 'var(--border-radius-xs)',
                sm: 'var(--border-radius-sm)',
                md: 'var(--border-radius-m)',
                lg: 'var(--border-radius-l)',
                full: 'var(--border-radius-circle)',
            },
        },
    },
    plugins: [],
} satisfies Config
