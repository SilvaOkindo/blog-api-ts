import User from '@/models/user';
import Blog from '@/models/blog'
import config from '@/config'
import { logger } from '@/lib/logger'
import { Response, Request } from 'express'

type Query = {
    status?: "draft" | "published"
}

export const getBlogsByUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.params.userId
        const currentUser = req.userId

        const limit = parseInt(req.query.limit as string) || config.defaultResLimit
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset


        const user = await User.findById(currentUser).select("role").exec()
        console.log(user)

        // get published blogs only if user.role === user
        const query: Query = {}
        if (user?.role === "user") {
            query.status = "published"
        }

        const total = await Blog.countDocuments({author: userId, ...query})

        const blogs = await Blog.find({author: userId, ...query})
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