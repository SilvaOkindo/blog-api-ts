import { Response, Request } from "express";
import bcrypt from 'bcrypt'

import { logger } from "@/lib/logger";
import User from '@/models/user'
import Token from '@/models/refresh-token'
import { IUser } from "@/models/user";
import { generateAccessToken } from "@/lib/jwt";
import { generateRefreshToken } from "@/lib/jwt";
import config from '@/config/index'

type UserData = Pick<IUser, 'email' | 'password'>

export const login = async (req: Request, res: Response):Promise<void>  => {
    try {
        const { email, password } = req.body as UserData
        const user = await User.findOne({email})
            .select('username email password')
            .lean()
            .exec()

        if(!user) {
            res.status(404).json({
                code: 'NotFound',
                message: 'user not found'
            })
            logger.warn('user not found')
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) {
            res.status(400).json({
                message: 'Invalid password or email'
            })
            return
        }

        // generate access token
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        // save refresh token to the database
        await Token.create({
            token: refreshToken,
            userId: user._id
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production'
        })


        res.status(201).json({
            user: {
            username: user.username,
            email: user.email,
            role: user.role,
            },
            accessToken
        })
        logger.info('user logged in successfully', {user: user._id})
    } catch (error) {
        logger.error('An error occurred while logging in a user.', error)
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}