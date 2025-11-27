import Token  from '@/models/refresh-token';
import { Request, Response } from "express";


import {logger} from '@/lib/logger'
import config from '@/config';

export const logout = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if(refreshToken) {
            await Token.deleteOne({
                token: refreshToken
            })
            logger.info('User refresh token deleted successfully', {
                userId: req.userId
            })
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        logger.info('User logged out successfully', {userId: req.userId})
        res.sendStatus(204)
    } catch (error) {
        logger.error("An error occurred while logging out the user")
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
    }
}