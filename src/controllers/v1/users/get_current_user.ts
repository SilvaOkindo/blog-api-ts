import User from '@/models/user';
import type {Response, Request} from 'express'

import {logger} from '@/lib/logger'
import { error } from 'console';


export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.userId

        const user = await User.findById(userId).select('-__v').lean().exec()

        res.status(200).json({
            user: user
        })

    } catch(err) {
        logger.error("An error occurred while getting the current user")
        res.status(500).json({
            message: 'Internal server',
            error: error
        })
    }
}