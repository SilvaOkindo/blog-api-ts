import { Types } from 'mongoose';
import {Response, Request, NextFunction} from 'express'
import {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken'

import {logger} from '@/lib/logger'

import { verifyToken } from '@/lib/jwt'


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization

    if(!authHeaders?.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Access denied, no token provided.'
        })
        return 
    }

    const [_, token] = authHeaders?.split(' ')

    try {

        const {userId} = verifyToken(token) as {userId: Types.ObjectId}
        req.userId = userId

        return next()

    } catch(err) {
        logger.error('An error occurred while authenticating the user')
        if(err instanceof TokenExpiredError) {
            res.status(401).json({
                message: 'Token has expired, login and try again'
            })
            return
        }

        if(err instanceof JsonWebTokenError) {
            res.status(401).json({
                message: 'Access token invalid.'
            })
            return
        }


        res.status(500).json({
            message: 'Internal server error'
        })
    }

}