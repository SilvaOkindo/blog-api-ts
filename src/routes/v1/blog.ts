import { authorize } from "@/middleware/authorize";
import { createBlog } from "@/controllers/v1/blog/create-blog";
import { Router } from "express";
import multer from 'multer'

const router = Router()

const upload = multer()

router.post('/', authorize(['admin']), upload.single("banner_image"), createBlog)

export default router