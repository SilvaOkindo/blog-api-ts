import { Response, Request} from 'express'


import { logger } from "@/lib/logger"
import Blog from '@/models/blog'
import Likes from '@/models/likes'




export const likeBlog = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userId = req.userId
        const blogId = req.params.blogId

        const blog = await Blog.findById(blogId).select("likesCount").exec()

        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            })
            return
        }

        const existingLike = await Likes.findOne({userId, blogId})

        if(existingLike) {
            res.status(400).json({
                message: "You already liked the blog"
            })
            return
        }

        await Likes.create({userId, blogId})
        blog.likesCount++
        await blog.save()

        logger.info("Blog liked successfully", {blogId, userId})

        res.status(201).json({
            likesCount: blog.likesCount
        })

        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
        logger.error("Error occurred while liking a blog")
    }
}