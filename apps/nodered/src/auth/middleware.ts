import type { RequestHandler } from 'express'
import { verifyJWT } from './verify'

export const isAuthenticated: RequestHandler = async (req, res, next) => {
    try {
        const authenticated = await verifyJWT(req.headers.cookie)
        if (!authenticated) {
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

        return next()
    } catch (err) {
        console.error(err)
        res.status(500).json({
            error: 'internal_server_error',
        })
    }
}
