import path from 'path'
import { fileURLToPath } from 'url'
import express, { CookieOptions } from 'express'
import { verifyJWT } from './verify'
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserAttribute,
    CognitoUserPool,
} from 'amazon-cognito-identity-js'
import { HOME_PATH } from '../utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const authRoutes = express.Router()

// AWS Cognito setup
if (!process.env.AWS_COGNITO_USER_POOL_ID) {
    throw new Error('AWS_COGNITO_USER_POOL_ID env missing')
}

if (!process.env.AWS_COGNITO_CLIENT_ID) {
    throw new Error('AWS_COGNITO_CLIENT_ID env missing')
}

const userPool = new CognitoUserPool({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
})

authRoutes.get('/login', async (req, res) => {
    if (await verifyJWT(req.headers.cookie)) {
        res.redirect(303, HOME_PATH)
        return
    }

    res.sendFile(path.join(__dirname, 'login.html'))
})

authRoutes.post('/login', async (req, res) => {
    if (await verifyJWT(req.headers.cookie)) {
        res.status(400).json({
            error: 'already_logged_in',
        })
        return
    }

    const { email, password } = req.body
    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
            error: 'invalid_credentials',
        })
        return
    }

    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    })

    const cognitoUser = new CognitoUser({
        Username: email,
        Pool: userPool,
    })

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {
            if (!result.isValid) {
                res.status(401).json({
                    error: 'login_failed',
                })
                return
            }

            const cookieOpts: CookieOptions = {
                httpOnly: true,
                secure: req.secure,
                path: '/',
                sameSite: 'lax',
            }
            res.cookie('idToken', result.getIdToken().getJwtToken(), {
                ...cookieOpts,
                maxAge: 60 * 60 * 1000,
            })
            res.cookie('accessToken', result.getAccessToken().getJwtToken(), {
                ...cookieOpts,
                maxAge: 60 * 60 * 1000,
            })
            res.cookie('refreshToken', result.getRefreshToken().getToken(), {
                ...cookieOpts,
                maxAge: 60 * 60 * 24 * 60 * 1000,
            })

            res.json({
                success: true,
            })
        },
        onFailure: err => {
            console.error(err)
            // err.message
            res.status(401).json({
                error: 'login_failed',
            })
        },
    })
    return
})

authRoutes.get('/signup', async (req, res) => {
    if (await verifyJWT(req.headers.cookie)) {
        res.redirect(303, HOME_PATH)
        return
    }

    res.sendFile(path.join(__dirname, 'signup.html'))
})

authRoutes.post('/signup', async (req, res) => {
    if (await verifyJWT(req.headers.cookie)) {
        res.status(400).json({
            error: 'already_logged_in',
        })
        return
    }

    const { email, password, deviceId } = req.body
    if (typeof email !== 'string' || typeof password !== 'string') {
        res.status(400).json({
            error: 'invalid_credentials',
        })
        return
    }

    if (!deviceId || typeof deviceId !== 'string') {
        res.status(400).json({
            error: 'invalid_device_id',
        })
        return
    }

    const attributeList = [
        new CognitoUserAttribute({
            Name: 'email',
            Value: email,
        }),
        new CognitoUserAttribute({
            Name: 'custom:deviceId',
            Value: deviceId,
        }),
    ]

    userPool.signUp(email, password, attributeList, [], (err, result) => {
        if (err) {
            console.error(err)
            // err.message
            res.status(400).json({
                error: 'signup_failed',
            })
            return
        }

        res.json({
            success: true,
        })
    })
    return
})

authRoutes.get('/logout', async (req, res) => {
    if (!(await verifyJWT(req.headers.cookie))) {
        res.redirect(303, '/auth/login')
        return
    }

    // TODO: Revoke refresh token
    const cookieOpts: CookieOptions = {
        maxAge: 0,
    }

    res.cookie('idToken', '', cookieOpts)
    res.cookie('accessToken', '', cookieOpts)
    res.cookie('refreshToken', '', cookieOpts)

    res.redirect(303, '/auth/login')
})

export { authRoutes }
