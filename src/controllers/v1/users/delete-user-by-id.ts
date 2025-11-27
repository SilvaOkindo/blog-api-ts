import {Request, Response} from 'express'


import { logger } from "@/lib/logger";
import User from '@/models/user'

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        

        const userId = req.params.userId

        const user = await User.findByIdAndDelete(userId)

        if(!user) {
            res.status(404).json({
                message: "user not found"
            })
            return
        }

        res.sendStatus(204)
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error
        })
        logger.error('Error while getting user by id', error)
    }
}