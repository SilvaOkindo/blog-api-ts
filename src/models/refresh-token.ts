import { Schema, Types, model } from "mongoose";

export interface IRefreshToken {
    userId: Types.ObjectId,
    token: string
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    }
})

export default model<IRefreshToken>('RefreshToken', refreshTokenSchema)