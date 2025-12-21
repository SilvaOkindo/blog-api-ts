import { Response, Request} from 'express'


import { logger } from "@/lib/logger"
import Blog from '@/models/blog'
import { IComment } from '@/models/comment'
import Comment from '@/models/comment'




export const getCommentsByBlog = async (req: Request, res: Response) : Promise<void> => {
    try {
        const blogId = req.params.blogId
       
        const blog = await Blog.findById(blogId).select("_id").lean().exec()

        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            })
            return
        }

        const comments = await Comment.find({blogId}).sort({createdAt: -1}).lean().exec()

        res.status(200).json({
            comments
        })
    
        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
        logger.error("Error occurred while getting blog comments", err)
    }
}