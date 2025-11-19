import express from 'express'
import config from '@/config'
import cors, {  } from 'cors'
import type { CorsOptions } from 'cors'

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

app.get('/', (req, res) => {
    res.status(200).json({message: "server is up"})
})

app.listen(config.PORT, ()=> {
    console.log("server running on port 3000")
})

