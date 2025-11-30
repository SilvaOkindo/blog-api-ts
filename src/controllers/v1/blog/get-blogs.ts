import User from '@/models/user';
import Blog from '@/models/blog'
import config from '@/config'
import { logger } from '@/lib/logger'
import { Response, Request } from 'express'

type Query = {
    status?: "draft" | "published"
}

export const getBlogs = async (req: Request, res: Response): Promise<void> => {
    // TODO: check on total value and debug populate
    try {

        const userId = req.userId

        const limit = parseInt(req.query.limit as string) || config.defaultResLimit
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset

        const total = await Blog.countDocuments()

        const user = await User.findById(userId).select("role").exec()

        // get published blogs only if user.role === user
        const query: Query = {}
        if (user?.role === "user") {
            query.status = "published"
        }

        const blogs = await Blog.find(query)
            .select("-banner.publicId -__v")
            .populate("author", "-__v -createdAt -updatedAt")
            .limit(limit)
            .skip(offset)
            .sort({publishedAt: -1})
            .lean()
            .exec()

        res.status(200).json({
            limit,
            offset,
            total,
            blogs
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            error: error
        })
        logger.error("Error while getting all users")
    }
}