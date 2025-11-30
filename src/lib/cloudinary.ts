import {v2 as Cloudinary} from 'cloudinary'

import { logger } from '@/lib/logger'

import type { UploadApiResponse } from 'cloudinary'
import config from '@/config'

Cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
    secure: config.NODE_ENV === 'production'
})


export const uploadToCloudinary = (buffer: Buffer<ArrayBufferLike>, publicId?: string): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
        Cloudinary.uploader.upload_stream({
            allowed_formats: ['png', 'jpg', 'webp'],
            resource_type: 'image',
            folder: 'blog-api',
            public_id: publicId,
            transformation: {quality: 'auto'}
        }, (err, result) => {
            if(err) {
                logger.error('Error uploading image to cloudinary', {error: err})
                reject(err)
            }
            resolve(result)
        }).end(buffer)
    })
}