import dotenv from 'dotenv'

dotenv.config()

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    WHITELISTED_ORIGINS: ["http://localhost"],
    DB_URL: process.env.DB_URL
}

export default config

