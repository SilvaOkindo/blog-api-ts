import express from 'express'
import cors, {  } from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import limiter from './lib/limiter'

import type { CorsOptions } from 'cors'

import config from '@/config'
import v1Router from '@/routes/v1'
import { connectToDb, disconnectFromDB } from './lib/mongoose'



const app = express()

// configure cors

const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if(config.NODE_ENV === 'development' || !origin || config.WHITELISTED_ORIGINS.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error(`CORS ERROR: ${origin} is not allowed by cors`), false)
        }
    }
}

// middlewares

app.use(cors(corsOptions))
app.use(express.urlencoded({extended: true}))
app.use(compression({threshold: 1024})) // compress only requests larger than 1024kb
app.use(cookieParser())
app.use(helmet())
app.use(limiter);


(async () => {
    try {

        await connectToDb()
        app.use('/api/v1', v1Router)

    } catch (error) {
        console.log("Failed to start the server", error);
        
        if(process.env.NODE_ENV === 'production') {
            process.exit(1)
        }
    }
})();

app.listen(config.PORT, ()=> {
    console.log("server running on port 3000")
})


const handleServerShutdown = async () => {
    try {
        await disconnectFromDB()
        console.log('server SHUTDOWN')
    } catch (e) {
        console.log('An error occurred while shutting down the server', e)
    }
}

// listening to SIGTERM SIGINT

process.on('SIGTERM', handleServerShutdown)
process.on('SIGINT', handleServerShutdown)

