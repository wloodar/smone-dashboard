import React from 'react'
import { Input, InputError } from './components/input'
import { Button } from './components/button'
import { useForm } from 'react-hook-form'

const Login = () => {
    const [generalError, setGeneralError] = React.useState('')

    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm()

    const onSubmit = handleSubmit(
        async ({ email, password, passwordRepeat, deviceId }) => {
            if (password !== passwordRepeat) {
                setGeneralError('Hasła nie są takie same')
                return
            }

            const res = await fetch(`/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, deviceId }),
            })

            if (res.status === 200) {
                location.href = '/auth/login?signup_status=success'
            } else {
                setGeneralError('Niepoprawne dane rejestracji')
            }
        }
    )

    return (
        <div className='h-screen flex items-center justify-center'>
            <div className='max-w-sm w-full -mt-12 border rounded-md px-4 pb-4 bg-neutral-50'>
                <div className='py-6 mb-4 text-center border-b'>
                    <img
                        src='/public/favicon.ico'
                        alt='logo'
                        className='w-12 mx-auto rounded-md mb-2'
                    />
                    <h1 className='font-medium text-2xl'>Zarejestruj się</h1>
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
                    <Input
                        label='Powtórz hasło'
                        type='password'
                        autoComplete='confirm-password'
                        {...register('passwordRepeat', {
                            required: 'Proszę powtórz hasło',
                        })}
                        errors={errors}
                        disabled={isSubmitting}
                    />
                    <Input
                        label='Identyfikator urządzenia'
                        type='text'
                        placeholder='0000000000'
                        {...register('deviceId', {
                            required: 'Proszę podaj id urządzenia',
                            minLength: {
                                value: 10,
                                message: 'Id urządzenia musi mieć 10 znaków',
                            },
                            maxLength: {
                                value: 10,
                                message: 'Id urządzenia musi mieć 10 znaków',
                            },
                        })}
                        errors={errors}
                        disabled={isSubmitting}
                    />
                    <InputError message={generalError} />
                    <Button isLoading={isSubmitting}>Zarejestruj się</Button>
                </form>
                <div className='flex items-center gap-3 py-4'>
                    <div className='flex-1 bg-neutral-300 h-px'></div>
                    <div className='text-xs text-neutral-400'>Lub</div>
                    <div className='flex-1 bg-neutral-300 h-px'></div>
                </div>
                <div>
                    <Button
                        external
                        href='/auth/login'
                        size={'small'}
                        variant={'secondary'}
                        className='w-full text-center'
                    >
                        Zaloguj się
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login
