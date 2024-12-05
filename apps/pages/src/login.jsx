import React from 'react'
import { Input, InputError } from './components/input'
import { Button } from './components/button'
import { useForm } from 'react-hook-form'
import Info from '@geist-ui/icons/info'

const Login = () => {
    const [generalError, setGeneralError] = React.useState('')

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm()

    const onSubmit = handleSubmit(async ({ email, password }) => {
        const res = await fetch(`/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })

        if (res.status === 200) {
            location.reload()
        } else {
            // alert('Error signing in: ' + (await res.text()))
            setGeneralError('Niepoprawne dane logowania')
        }
    })

    return (
        <div className='h-screen flex items-center justify-center'>
            <div className='max-w-sm -mt-12 w-full'>
                {new URLSearchParams(window.location.search).get(
                    'signup_status'
                ) === 'success' && (
                    <div className='bg-green-50 flex items-center gap-3 shadow-card mb-4 px-4 py-2 text-green-800 mt-3 rounded-md text-sm'>
                        <Info className='stroke-2 stroke-green-800' />
                        Rejestracja przebiegła pomyślnie. Możesz się teraz
                        zalogować.
                    </div>
                )}
                <div className='border rounded-md px-4 pb-4 bg-neutral-50'>
                    <div className='py-6 mb-4 text-center border-b'>
                        <img
                            src='/public/favicon.ico'
                            alt='logo'
                            className='w-12 mx-auto rounded-md mb-2'
                        />
                        <h1 className='font-medium text-2xl'>Zaloguj się</h1>
                    </div>
                    <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                        <Input
                            label='Adres Email'
                            type='email'
                            autoComplete='email'
                            {...register('email', {
                                required: 'Proszę podaj poprawny adres email',
                            })}
                            errors={errors}
                            disabled={isSubmitting}
                        />
                        <Input
                            label='Hasło'
                            type='password'
                            autoComplete='current-password'
                            {...register('password', {
                                required: 'Proszę podaj hasło',
                            })}
                            errors={errors}
                            disabled={isSubmitting}
                        />
                        <InputError message={generalError} />
                        <Button isLoading={isSubmitting}>Zaloguj się</Button>
                    </form>
                    <div className='flex items-center gap-3 py-4'>
                        <div className='flex-1 bg-neutral-300 h-px'></div>
                        <div className='text-xs text-neutral-400'>Lub</div>
                        <div className='flex-1 bg-neutral-300 h-px'></div>
                    </div>
                    <div>
                        <Button
                            external
                            href='/auth/signup'
                            size={'small'}
                            variant={'secondary'}
                            className='w-full text-center'
                        >
                            Zarejestruj się
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
