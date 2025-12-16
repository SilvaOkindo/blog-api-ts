import type {Response, Request} from 'express'
import {v2 as cloudinary} from 'cloudinary'

import Blog from '@/models/blog'
import User from '@/models/user'
import { logger } from '@/lib/logger'

export const deleteBlog = async (req: Request, res: Response) : Promise<void> => {
    try {

        const blogId = req.params.blogId
        const userId = req.userId

        const user = await User.findById(userId).select('role').lean().exec()

        const blog = await Blog.findById(blogId)

        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            }
            )
            return
        }

        if(!blog?.author.equals(userId) && user?.role !== 'admin') {
            res.status(403).json({
                message: "You don't have enough permissions to delete this blog"
            })

            return
        }

        await cloudinary.uploader.destroy(blog.banner.publicId)

        logger.info("Image deleted successfully from cloudinary")

        await Blog.findByIdAndDelete(blogId)
        logger.info("Blog deleted successfully")
        res.sendStatus(204)
        
    } catch (err) {
        res.status(500).json({
            message: "Internal server",
            err
        })
        logger.error("Error occurred while deleting blog", err)
    }
}