import { logger } from "@/lib/logger";
import { Response, Request } from "express";

export const registerUser = async (req: Request, res: Response):Promise<void>  => {
    try {
        console.log('hello')
        res.status(201)
    } catch (error) {
        logger.info('An error occurred while registering a user.')
        res.status(500).json({
            message: 'Internal server error'
        })
    }
}