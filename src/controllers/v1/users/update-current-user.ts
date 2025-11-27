import type {Response, Request, NextFunction} from 'express'

import User from '@/models/user'
import { logger } from '@/lib/logger'

export const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            username,
            email,
            first_name,
            last_name,
            website,
            facebook,
            instagram,
            linkedin,
            x,
            youtube
        } = req.body
        const user = await User.findById(req.userId).select('-password -__v').exec()


        if(!user) {
            res.status(404).json({
                message: 'User not found'
            })
            return
        }

        if(username) user.username = username
        if(email) user.email = email
        if(first_name) user.firstName = first_name
        if(last_name) user.lastName = last_name
        //if(password) user.password = password
        if(!user.sociallinks)  {
            user.sociallinks = {}
        } 

        if(website) user.sociallinks.website = website
        if(x) user.sociallinks.x = x
        if(linkedin) user.sociallinks.linkedin = linkedin
        if(facebook) user.sociallinks.facebook = facebook
        if(instagram) user.sociallinks.instagram = instagram
        if(youtube) user.sociallinks.youtube = youtube

        await user.save()
        res.status(200).json({
            user: user
        })
    } catch (error) {
        res.status(500).json({
            message: "internal server error",
            error
        })
        logger.error('An errror occurred while updating the user', error)
    }
}