import express from 'express'
import config from '@/config'
import cors, {  } from 'cors'
import type { CorsOptions } from 'cors'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import limiter from './lib/limiter'

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
app.use(limiter)

app.get('/', (req, res) => {
    res.status(200).json({message: "server is up"})
})

app.listen(config.PORT, ()=> {
    console.log("server running on port 3000")
})

