import { Response, Request} from 'express'
import  DOMPurify  from 'dompurify'
import {JSDOM} from 'jsdom'

import { logger } from "@/lib/logger"
import Blog, { IBlog } from '@/models/blog'


 //const window = new JSDOM('').window
//const purify = DOMPurify(window)

type blogData = Pick<IBlog, "content"| "banner" | "status" | "title">

export const createBlog = async (req: Request, res: Response) : Promise<void> => {
    try {

        const {title, content, status, banner} = req.body as blogData
        const userId = req.userId

        //const cleanContent = purify.sanitize(content)

        const newBlog = await Blog.create({
            title,
            content,
            author: userId,
            banner,
            status
        })

    
        res.status(201).json({
            blog: newBlog
        })
        logger.info("New blog created successfully")

        
    } catch (err) {
        res.status(500).json({
            message: "Internal server error"
        })
        logger.error("Error occurred while creating a blog")
    }
}