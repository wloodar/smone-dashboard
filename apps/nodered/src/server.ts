import http from 'http'
import RED from 'node-red'
import express from 'express'
import bodyParser from 'body-parser'
import 'dotenv/config'
import { settings } from './settings'
import { authRoutes } from './auth/routes'
import { isAuthenticated } from './auth/middleware'
import { trimPrefix } from './utils'

const app = express()
const server = http.createServer(app)

// Initialise the runtime with a server and settings
RED.init(server, settings)

app.use('/public', express.static('public'))
app.use('/auth', bodyParser.json(), authRoutes)

// ! Crucial
// node-red-dashboard use service workers to cache the
// dashboard assets. We need to disable this behaviour
// as we need to ensure that user is alway authenticated
app.use((req, res, next) => {
    if (
        trimPrefix(req.path, '/dashboard') === '/sw.js' ||
        req.path.endsWith('sw.js')
    ) {
        res.status(404).end()
        return
    }
    next()
})

// Guard all of the routes
app.use((req, res, next) => {
    if (trimPrefix(req.path, '/dashboard').startsWith('/public')) {
        next()
        return
    }

    return isAuthenticated(req, res, next)
})

// Serve the editor UI from /red
app.use(settings.httpAdminRoot as string, RED.httpAdmin)

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot as string, RED.httpNode)

server.listen(1880)

// Start the runtime
RED.start()
