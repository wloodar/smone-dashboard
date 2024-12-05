import cookie from 'cookie'
import jwt, { type SigningKeyCallback, type JwtHeader } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

if (!process.env.AWS_COGNITO_ISSUER) {
    throw new Error('AWS_COGNITO_ISSUER env missing')
}

if (!process.env.AWS_COGNITO_CLIENT_ID) {
    throw new Error('AWS_COGNITO_CLIENT_ID env missing')
}

export const verifyJWT = async ({
    cookieStr,
    idToken,
}: {
    cookieStr?: string
    idToken?: string
}): Promise<jwt.JwtPayload | null> => {
    const parsedIdToken = idToken
        ? idToken
        : cookieStr
          ? cookie.parse(cookieStr).idToken
          : null
    if (!parsedIdToken) {
        return null
    }

    const jwtPayload = await new Promise(resolve => {
        jwt.verify(
            parsedIdToken,
            getKey,
            {
                algorithms: ['RS256'],
                issuer: process.env.AWS_COGNITO_ISSUER,
                audience: process.env.AWS_COGNITO_CLIENT_ID,
            },
            function (err, decoded) {
                if (err) {
                    console.error(err)
                    resolve(null)
                    return
                }

                resolve(decoded)
            }
        )
    })

    if (!jwtPayload) {
        return null
    }

    return jwtPayload
}

const client = jwksClient({
    jwksUri: `${process.env.AWS_COGNITO_ISSUER}/.well-known/jwks.json`,
})

const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
    client.getSigningKey(header.kid, function (err, key) {
        if (err) {
            console.error(err)
            callback(err)
            return
        }

        if (!key) {
            callback(new Error('No key found'))
            return
        }

        callback(null, key.getPublicKey())
    })
}
