import dotenv from 'dotenv'
import ms from 'ms'

dotenv.config()

const config = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    WHITELISTED_ORIGINS: ["http://localhost"],
    DB_URL: process.env.DB_URL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as ms.StringValue
}

export default config

