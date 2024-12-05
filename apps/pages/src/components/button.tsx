import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { Spinner } from './spinner'
import { clx } from '../utils/clx'

const buttonVariants = cva(clx('relative outline-none'), {
    variants: {
        variant: {
            primary: clx(
                'bg-[#147e67] text-white font-medium duration-150 transition ease-in-out border border-[#147e67]',
                'hover:bg-[#147e67]/90',
                'disabled:bg-[#147e67]/50'
            ),
            secondary: clx(
                'bg-white text-black shadow-card font-medium duration-150 transition ease-in-out',
                'hover:bg-neutral-100',
                'disabled:bg-neutral-200 disabled:opacity-70'
            ),
        },
        size: {
            xsmall: clx(
                'px-2 py-1 text-sm',
                '[&_svg]:stroke-2 [&_svg]:w-2.5 [&_svg]:h-auto'
            ),
            small: clx(
                'px-2.5 py-1.5 text-sm',
                '[&_svg]:stroke-2 [&_svg]:w-3.5 [&_svg]:h-auto'
            ),
            base: clx(
                'px-8 py-2 text-sm',
                '[&_svg]:stroke-2 [&_svg]:w-4 [&_svg]:h-auto'
            ),
        },
    },
    compoundVariants: [
        {
            variant: ['primary', 'secondary'],
            size: ['base', 'small'],
            className: 'rounded-xl',
        },
        {
            variant: ['primary', 'secondary'],
            size: ['xsmall'],
            className: 'rounded-lg',
        },
    ],
    defaultVariants: {
        size: 'base',
        variant: 'primary',
    },
})

type ButtonPropsWithAnchor = {
    isLoading?: boolean
    asChild?: boolean
    href: string
    external: true
} & React.ComponentPropsWithoutRef<'a'> &
    VariantProps<typeof buttonVariants>

type ButtonPropsWithLink = {
    isLoading?: boolean
    asChild?: boolean
    external: false
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> &
    VariantProps<typeof buttonVariants>

export type ButtonPropsClean = {
    isLoading?: boolean
    asChild?: boolean
} & React.ComponentPropsWithoutRef<'button'> &
    VariantProps<typeof buttonVariants>

export type ButtonProps = (
    | ButtonPropsWithAnchor
    | ButtonPropsWithLink
    | ButtonPropsClean
) & {
    innerClassName?: string
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            className,
            innerClassName,
            size,
            asChild = false,
            children,
            isLoading = false,
            iconLeft,
            iconRight,
            ...props
        },
        ref
    ) => {
        const Component = asChild ? Slot : 'button'

        /**
         * In the case of a button where asChild is true, and isLoading is true, we ensure that
         * only on element is passed as a child to the Slot component. This is because the Slot
         * component only accepts a single child.
         */
        const renderInner = () => {
            return (
                <>
                    {iconLeft && iconLeft}
                    {children}
                    {isLoading && (
                        <div className='absolute bottom-0 left-0 top-0 flex items-center px-4'>
                            <Spinner />
                        </div>
                    )}
                    {iconRight && iconRight}
                </>
            )
        }

        // Handle a and Link casually but with
        // the button stylings
        if ('href' in props) {
            if (props.external) {
                return (
                    <a
                        {...props}
                        className={clx(
                            'block',
                            buttonVariants({ variant, size }),
                            className,
                            {
                                'opacity-80': isLoading,
                            }
                        )}
                    >
                        {renderInner()}
                    </a>
                )
            }
        }

        // Return regular button
        return (
            <Component
                ref={ref}
                {...props}
                className={clx(buttonVariants({ variant, size }), className, {
                    'opacity-80 pointer-events-none': isLoading,
                })}
                // disabled={props.disabled || isLoading}
            >
                {renderInner()}
            </Component>
        )
    }
)
