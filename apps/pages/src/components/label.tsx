'use client'

import React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { clx } from '../utils/clx'

const labelVariants = cva('', {
    variants: {
        size: {
            small: 'text-xs font-medium mb-1.5',
            base: 'text-sm font-medium mb-1.5',
        },
    },
    defaultVariants: {
        size: 'base',
    },
})

type LabelProps = VariantProps<typeof labelVariants> &
    React.ComponentPropsWithoutRef<'label'> & {
        required?: boolean
    }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ size, className, children, ...props }, ref) => (
        <label ref={ref} className={clx(labelVariants({ size }), className)}>
            {children}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
    )
)
