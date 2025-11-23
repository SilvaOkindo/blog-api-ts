import { Schema, model } from "mongoose";

export interface IUser {
    username: string,
    email: string,
    password: string,
    role: 'admin' | 'user',
    firstName?: string,
    lastName?: string,
    sociallinks?: {
        website?: string,
        facebook?: string,
        x?: string,
        instagram?: string,
        youtube?: string,
        linkedin?: string
    }
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'usernam is required'],
        maxLength: [20, 'username should be less than 20 characters'],
        unique: [true, 'username should be unique']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        maxLength: [50, 'email should be less than 50 characters'],
        unique: [true, 'email should be unique']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false,
    },
    role: {
        type: String,
        required: [true, 'role is required'],
        enum: {
            values: ['admin', 'user'],
            messages: 'VALUE is not valid'
        }
    },
    firstName: {
        type: String,
        maxLength: [20, 'first name should be less than 20 characters']
    },
    lastName: {
        type: String,
        maxLength: [20, 'last name should be less than 20 characters']
    },
    sociallinks: {
        website: {
            type: String,
            maxLength: [100, 'website link should be less 100 characters']
        },
        facebook: {
            type: String,
            maxLength: [100, 'facebook profile should be less 100 characters']
        },
        instagram: {
            type: String,
            maxLength: [100, 'instagram profile should be less 100 characters']
        },
        x: {
            type: String,
            maxLength: [100, 'x profile should be less 100 characters']
        },
        linkedin: {
            type: String,
            maxLength: [100, 'linkedin profile should be less 100 characters']
        }
    }
}, {timestamps: true})

export default model<IUser>('User', userSchema)