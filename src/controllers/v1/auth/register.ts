import { Response, Request } from "express";
import bcrypt from 'bcrypt'

import { logger } from "@/lib/logger";
import type { IUser } from "@/models/user";
import User from '@/models/user'
import { generateRandomUsername } from "@/utils/generate-random-username";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import config from "@/config";
import Token from '@/models/refresh-token'


type UserData = Pick<IUser, 'role' | 'email' | 'password'>

export const registerUser = async (req: Request, res: Response):Promise<void>  => {
    try {
        const {role, email, password} = req.body as UserData
        //console.log( email, password)

        // block users from registering as admins
        if(role === 'admin') {
            res.status(403).json({
                message: 'Authorization failed'
            })
            logger.warn('user tried to register as admin')
            return
        }

        const username = generateRandomUsername()

        const hashePassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashePassword,
            role
        })

        // generate access token
        const accessToken = generateAccessToken(newUser._id)
        const refreshToken = generateRefreshToken(newUser._id)

        // save refresh token to the database
        await Token.create({
            token: refreshToken,
            userId: newUser._id
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production'
        })


        res.status(201).json({
            user: {
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            },
            accessToken
        })
        logger.info('user registered successfully')
    } catch (error) {
        logger.error('An error occurred while registering a user.')
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}