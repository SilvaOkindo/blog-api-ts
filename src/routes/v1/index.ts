import { Router } from "express";

import authRoutes from '@/routes/v1/auth'
import usersRoutes from '@/routes/v1/users'
import blogRoutes from '@/routes/v1/blog'

const router = Router()


// routes


router.get('/', (req, res) => {
    res.status(200).json({
        message: 'API is live',
        status: 'ok',
        version: '1.0.0',
        timeStamp: new Date().toISOString()
    })
})

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/blogs', blogRoutes)

export default router