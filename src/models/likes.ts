import User from '@/models/user';
import {model, Schema, Types} from 'mongoose'

export interface ILikes {
    blogId?: Types.ObjectId
    userId: Types.ObjectId
    commentId?: Types.ObjectId
}

const LikeSchema = new Schema<ILikes>({
    blogId: {
        type: Schema.Types.ObjectId
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    commentId: {
        type: Schema.Types.ObjectId
    }
})

export default model<ILikes>("Like", LikeSchema)