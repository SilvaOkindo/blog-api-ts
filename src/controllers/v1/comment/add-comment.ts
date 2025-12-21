import { Response, Request} from 'express'


import { logger } from "@/lib/logger"
import Blog from '@/models/blog'
import { IComment } from '@/models/comment'
import Comment from '@/models/comment'


type CommentData = Pick<IComment, 'comment'>

export const addComment = async (req: Request, res: Response) : Promise<void> => {
    try {
        const userId = req.userId
        const blogId = req.params.blogId
        const comment = req.body.comment as CommentData

        const blog = await Blog.findById(blogId).select("commentCount").exec()

        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            })
            return
        }

        const newComment = await Comment.create({
            userId,
            blogId,
            comment
        })

        logger.info("New comment added", newComment)

        blog.commentsCount++
        await blog.save()

        res.status(201).json({
            newComment
        })
        
        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
        logger.error("Error occurred while commenting a blog", err)
    }
}