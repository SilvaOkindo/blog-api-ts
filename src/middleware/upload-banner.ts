import type {Request, Response, NextFunction} from 'express'

import Blog from '@/models/blog'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { logger } from '@/lib/logger'
import { UploadApiErrorResponse } from 'cloudinary'

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
            const {blogId} = req.params
            //const blog = await Blog.findById(blogId)

            const data = await uploadToCloudinary(req.file.buffer,
               // blog?.banner.publicId.replace('blog-api/', '')
            )
            if(!data) {
                res.status(500).json({
                    message: 'Internal server error'
                })
                logger.error("Error while uploading to blog banner to cloudinary")
            }

            const newBanner = {
                publicId: data?.public_id,
                url: data?.secure_url,
                width: data?.width,
                height: data?.height
            }

            logger.info("Blog banner uploaded to cloudinary successfully")
            req.body.banner = newBanner
            next()
        } catch (error: UploadApiErrorResponse | any) {
            res.status(error.http_code).json({
                message: error.message
            })
            logger.error("Error uploading image to cloudinary", error.message)
        }
    }
}