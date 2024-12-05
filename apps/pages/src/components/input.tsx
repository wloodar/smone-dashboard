'use client'

import React from 'react'
import { VariantProps, cva } from 'class-variance-authority'
import { get } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { clx } from '../utils/clx'
import { Label } from './label'

import Eye from '@geist-ui/icons/eye'
import EyeOff from '@geist-ui/icons/eyeOff'
import AlertCircleFill from '@geist-ui/icons/alertCircleFill'
import Mail from '@geist-ui/icons/mail'
import { Skeleton } from './skeletons'

const inputVariants = cva(
    clx(
        '[&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden'
    ),
    {
        variants: {
            size: {
                base: 'h-10 px-2.5 text-sm border-[1.5px]',
                small: 'h-8 px-2.5 text-sm border',
            },
        },
        defaultVariants: {
            size: 'base',
        },
    }
)

type InputProps = VariantProps<typeof inputVariants> &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
        label?: string
        name: string
        errors?: Record<string, unknown>
        touched?: Record<string, unknown>
        skeleton?: boolean
    }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            label,
            name,
            required,
            size = 'base',
            disabled,
            errors,
            touched,
            skeleton,
            ...props
        },
        ref
    ) => {
        const inputRef = React.useRef<HTMLInputElement>(null)

        const [showPassword, setShowPassword] = React.useState(false)
        const [inputType, setInputType] = React.useState(type)

        React.useEffect(() => {
            if (type === 'password' && showPassword) {
                setInputType('text')
            }

            if (type === 'password' && !showPassword) {
                setInputType('password')
            }
        }, [type, showPassword])

        React.useImperativeHandle(ref, () => inputRef.current!)

        const hasError = get(errors, name)

        return (
            <div className='flex w-full flex-col'>
                <div className='relative z-0 flex flex-col w-full'>
                    {label && (
                        <Label
                            htmlFor={name}
                            required={required}
                            onClick={() => inputRef.current?.focus()}
                        >
                            {label}
                        </Label>
                    )}
                    <div className='w-full flex relative'>
                        <input
                            type={inputType}
                            name={name}
                            aria-invalid={hasError}
                            placeholder=' '
                            className={clx(
                                inputVariants({ size }),
                                'mt-0 block w-full text-[#303030] appearance-none rounded-lg border-transparent shadow-card transition duration-200',
                                'outline-2 outline-neutral-300 hover:outline focus:outline focus:border-black hover:border-black hover:shadow-none focus:ring-0 peer',
                                {
                                    'pointer-events-none cursor-not-allowed opacity-70':
                                        disabled,
                                    'pr-12': inputType === 'password',
                                    'pl-10': inputType === 'email',
                                    'border-rose-400 invalid:border-rose-400 focus:border-rose-400 aria-[invalid=true]:border-rose-400':
                                        hasError,
                                },
                                {
                                    'opacity-0': skeleton,
                                }
                            )}
                            {...props}
                            ref={inputRef}
                        />
                        {type === 'email' && (
                            <div
                                className={clx(
                                    'absolute left-0 top-0 bottom-0 flex items-center px-4 peer-hover:[&>svg]:stroke-black peer-focus:[&>svg]:stroke-black'
                                )}
                            >
                                <Mail className='h-4 w-4 stroke-neutral-400 stroke-2 transition-all duration-200' />
                            </div>
                        )}
                        {type === 'password' && (
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className={clx(
                                    'absolute bottom-0 right-0 top-0 px-4 outline-none transition-all duration-150 focus:text-neutral-700 focus:outline-none'
                                )}
                            >
                                {showPassword ? (
                                    <EyeOff className='h-4 w-4' />
                                ) : (
                                    <Eye className='h-4 w-4' />
                                )}
                            </button>
                        )}
                        {skeleton && (
                            <Skeleton.Box className='absolute inset-0 h-full' />
                        )}
                    </div>
                </div>
                {hasError && (
                    <ErrorMessage
                        errors={errors}
                        name={name}
                        render={({ message }) => {
                            return (
                                <div className='pt-1 pl-1 text-xs font-medium text-rose-500 flex items-center gap-1'>
                                    <AlertCircleFill className='stroke-[2px] stroke-white w-4 h-auto' />
                                    <span>{message}</span>
                                </div>
                            )
                        }}
                    />
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

const InputError = React.forwardRef<
    HTMLDivElement,
    {
        message: string
        className?: string
    } & React.HTMLAttributes<HTMLDivElement>
>(({ message, className, ...props }, ref) => {
    if (!message) {
        return null
    }

    return (
        <div
            ref={ref}
            className={clx(
                'text-xs font-medium text-rose-500 flex items-start gap-1',
                className
            )}
            {...props}
        >
            <AlertCircleFill className='stroke-[2px] stroke-white w-4 h-auto' />
            <span>{message}</span>
        </div>
    )
})
InputError.displayName = 'InputError'

export { Input, InputError }
