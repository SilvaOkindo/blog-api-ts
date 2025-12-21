import User from '@/models/user';
import Blog from '@/models/blog'
import {model, Schema, Types} from 'mongoose'

export interface  IComment{
    blogId: Types.ObjectId
    userId: Types.ObjectId
    comment: string
}

const LikeSchema = new Schema<IComment>({
    blogId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: Blog
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    comment: {
        type: String
    }
})

export default model<IComment>("Comment", LikeSchema)