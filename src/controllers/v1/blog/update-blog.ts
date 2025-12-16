import User  from '@/models/user';
import Blog, { IBlog } from '@/models/blog'
import { logger } from '@/lib/logger'


import type {Response, Request} from 'express'



type BlogData = Pick<IBlog, "banner" | "status" | "content" | "title">


export const updateBlog = async (req: Request, res: Response): Promise<void> => {
    try {

        console.log(req)

        const {title, content, status, banner} = req.body as BlogData

        const userId = req.userId
        const blogId = req.params.blogId

        const user = await User.findById(userId).select('role').lean().exec()
        const blog = await Blog.findById(blogId).select("-__v").exec()

        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            })
            return
        }


        if(!blog.author.equals(userId) && user?.role !== "admin") {
            res.status(403).json({
                message: "You don't have enough permissions to update this blog."
            })
            return
        }  

        if(title) blog.title = title
        if(content) blog.content = content
        if(status) blog.status = status
        if(banner) blog.banner = banner

        await blog.save()

        res.status(200).json({
            blog
        })

        logger.info("Blog updated successfully")
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error
        })
        logger.error("Error occurred while updating the blog", error)
    }
}