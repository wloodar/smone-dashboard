import AWS from 'aws-sdk'
import cookie from 'cookie'
import type { CookieOptions, RequestHandler } from 'express'
import { verifyJWT } from './verify'
import { getCookieOpts } from '../utils'

const EXPIRE_COOKIE_OPTS: CookieOptions = {
    maxAge: 0,
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
    try {
        const authenticated = await verifyJWT({
            cookieStr: req.headers.cookie,
        })
        if (!authenticated) {
            // First try to refresh the token
            const cookies = cookie.parse(req.headers.cookie || '')
            const refreshTokenCookie = cookies.refreshToken
            if (!refreshTokenCookie) {
                res.redirect(303, '/auth/login')
                return
            }

            const refreshRes = await refreshToken(refreshTokenCookie)
            if (!refreshRes) {
                res.redirect(303, '/auth/login')
                return
            }

            res.cookie('idToken', refreshRes.idToken, {
                ...getCookieOpts(req),
                maxAge: 60 * 60 * 1000,
            })
            res.cookie('accessToken', refreshRes.accessToken, {
                ...getCookieOpts(req),
                maxAge: 60 * 60 * 1000,
            })

            const authenticated = await verifyJWT({
                idToken: refreshRes.idToken,
            })
            if (!authenticated) {
                res.cookie('idToken', '', EXPIRE_COOKIE_OPTS)
                res.cookie('accessToken', '', EXPIRE_COOKIE_OPTS)
                res.cookie('refreshToken', '', EXPIRE_COOKIE_OPTS)
                res.redirect(303, '/auth/login')
                return
            }

            // @ts-ignore
            req.session = {
                user: {
                    email: authenticated.email,
                    deviceIds: authenticated['custom:deviceIds'],
                },
            }

            next()
            return
        }

        // @ts-ignore
        req.session = {
            user: {
                email: authenticated.email,
                deviceIds: authenticated['custom:deviceIds'],
            },
        }

        next()
        return
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'internal_server_error',
        })
    }
}

const cognito = new AWS.CognitoIdentityServiceProvider({
    region: process.env.AWS_REGION,
})

const refreshToken = async (refreshTokenCookie: string) => {
    try {
        const authRes = await cognito
            .initiateAuth({
                AuthFlow: 'REFRESH_TOKEN_AUTH',
                ClientId: process.env.AWS_COGNITO_CLIENT_ID as string,
                AuthParameters: {
                    REFRESH_TOKEN: refreshTokenCookie,
                },
            })
            .promise()
        if (
            authRes.AuthenticationResult &&
            authRes.AuthenticationResult.IdToken &&
            authRes.AuthenticationResult.AccessToken
        ) {
            return {
                idToken: authRes.AuthenticationResult.IdToken,
                accessToken: authRes.AuthenticationResult.AccessToken,
            }
        }

        return false
    } catch (err) {
        console.error(err)
        return false
    }
}
