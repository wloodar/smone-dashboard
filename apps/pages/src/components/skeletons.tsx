import React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { clx } from '../utils/clx'

const blockVariants = cva('bg-neutral-200 animate-pulse', {
    variants: {
        roundness: {
            base: 'rounded-md',
        },
        size: {
            xsmall: 'h-4',
            small: 'h-6',
            base: 'h-8',
            large: 'h-12',
        },
    },
    defaultVariants: {
        roundness: 'base',
        size: 'base',
    },
})

type SkeletonBlockProps = {
    className?: string
} & VariantProps<typeof blockVariants> &
    Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>

export const Box = ({
    className,
    roundness,
    size,
    ...props
}: SkeletonBlockProps) => {
    return (
        <div
            className={clx(blockVariants({ roundness, size }), className)}
            {...props}
        />
    )
}

export const Skeleton = Object.assign(
    {},
    {
        Box,
    }
)
