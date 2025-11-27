import User from '@/models/user';
import {Response, Request} from 'express'

import { logger } from "@/lib/logger"

export const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.userId

        await User.deleteOne({_id: userId})
        res.sendStatus(204)

    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error
        })
        logger.error('An errror occurred while updating the user', error)
    }
}