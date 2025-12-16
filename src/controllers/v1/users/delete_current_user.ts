import User from '@/models/user';
import Blog from '@/models/blog'
import {Response, Request} from 'express'
import {v2 as cloudinary} from 'cloudinary'

import { logger } from "@/lib/logger"
import { log } from 'console';

export const deleteCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.userId

        const user = await User.findById(userId).select('role').lean().exec()

        if(!user) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        if(user.role === "admin") {

            const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec()
            const publicIds = blogs.map(({banner}) => banner.publicId)
            await cloudinary.api.delete_resources(publicIds)
            logger.info("deleted banners from cloudinary successfully")

            await Blog.deleteMany({author: userId})
            logger.info("Successfully deleted many blogs for", {userId})
        }

        await User.deleteOne({_id: userId})
        logger.info("Successfully deleted user", {userId})
        res.sendStatus(204)

    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error
        })
        logger.error('An errror occurred while updating the user', error)
    }
}