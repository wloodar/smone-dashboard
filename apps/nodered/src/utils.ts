import { CookieOptions, Request } from 'express'

export const HOME_PATH = '/'

export const trimPrefix = (str: string, prefix: string) => {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length)
    }
    return str
}

export const getCookieOpts = (req: Request): CookieOptions => {
    const cookieOpts: CookieOptions = {
        httpOnly: true,
        secure: req.secure,
        path: '/',
        sameSite: 'lax',
    }
    return cookieOpts
}
