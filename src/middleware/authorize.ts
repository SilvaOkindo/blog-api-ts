import { logger } from '@/lib/logger';
import User  from '@/models/user';
import { NextFunction, Response, Request } from "express";

export type AuthRoles = 'admin' | 'user'

export const authorize = (roles: AuthRoles[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.userId
    
        try {

            const user = await User.findById({_id: userId}).select('role').exec()

            if(!user) {
                res.status(404).json({
                    message: "User not found"
                })
                return
            }

            if(!roles.includes(user.role)) {
                res.status(403).json({
                    message: "Access denied, authorization needed"
                })
                return
            }

            return next()

        } catch(error) {
            res.status(500).json({
                message: 'Internal server error',
                error: error
            })

            logger.error("Error occurred while authorizing the user", {error: error})
        }
        
    }
}