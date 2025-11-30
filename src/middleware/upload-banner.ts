import type {Request, Response, NextFunction} from 'express'

import Blog from '@/models/blog'

const MAX_FILE_SIZE = 2 * 1024 * 1024

export const uploadBanner = (method: 'post' | 'put') => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if(method === 'put' && !req.file) {
            next()
            return
        }

        if(!req.file) {
            res.status(400).json({
                message: "Blog banner is required"
            })
            return
        }

        if(req.file.size > MAX_FILE_SIZE) {
            res.status(413).json({
                message: "File size must be less than 2 MB"
            })
        }

        try {
            
        } catch (error) {
            
        }
    }
}