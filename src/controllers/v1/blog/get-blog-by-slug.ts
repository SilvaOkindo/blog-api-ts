import User from '@/models/user';
import Blog from '@/models/blog'
import { logger } from '@/lib/logger'
import { Response, Request } from 'express'



export const getBlogBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const slug = req.params.slug
        const currentUser = req.userId

        const user = await User.findById(currentUser).select("role").lean( ).exec()

        const blog = await Blog.findOne({slug})
            .select("-banner.publicId -__v")
            .populate("author", "-__v -createdAt -updatedAt")
            .lean()
            .exec()
    
        if(!blog) {
            res.status(404).json({
                message: "Blog not found"
            })
            return
        }

        // block user from accessing draft blogs 
        
        if (user?.role === "user" && blog.status === 'draft') {
            res.status(403).json({
                message: "Permisson denied. You don't have enough credentials to access this."
            })
            logger.warn("User tried to access blog in draft")
            return
        }

        res.status(200).json({
            blog
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        logger.error("Error while getting blog by slug", {error})
    }
}