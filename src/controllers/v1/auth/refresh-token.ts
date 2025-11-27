import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import type {Request, Response} from 'express'
import { Types } from "mongoose";

import { logger } from "@/lib/logger";

import Token from '@/models/refresh-token'
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt";


export const refreshToken = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string
    
    try {
        const tokenExists = await Token.exists({token:refreshToken})
        if(!tokenExists) {
            res.status(401).json({
                message: 'Invalid refresh token'
            })
            return
        }

        // verify token
        const jwtPayload = verifyRefreshToken(refreshToken) as {userId: Types.ObjectId}
        const accessToken = generateAccessToken(jwtPayload.userId)
        res.status(200).json({
            accessToken
        })
    } catch (err) {
        if(err instanceof TokenExpiredError) {
            res.status(401).json({
                message: 'Token has expired. Please log in again.'
            })
            return
        }

        if(err instanceof JsonWebTokenError) {
            res.status(403).json({
                message: 'Invalid refresh token'
            })
            return
        }
        res.status(500).json({
            message: 'Internal server error',
            err
        })
        logger.error("An error occurred while refreshing token", err)
    }
}