import {Request, Response} from 'express'


import { logger } from "@/lib/logger";
import User from '@/models/user'

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        

        const userId = req.params.userId

        const user = await User.findById(userId)

        if(!user) {
            res.status(404).json({
                message: "user not found"
            })
            return
        }

        res.status(200).json({
            user
        })


    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        })
        logger.error('Error while getting user by id', error)
    }
}