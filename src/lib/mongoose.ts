import config from '@/config'
import { logger } from './logger'
import mongoose from 'mongoose'

import type { ConnectOptions } from 'mongoose'

const connectOptions: ConnectOptions = {
    dbName: "blog-db",
    appName: "Blog API",
    serverApi: "1",
}

export const connectToDb = async (): Promise<void> =>{
    if(!config.DB_URL) {
        throw new Error('MongoDB URI is not defined in configuration')
    }

    try {

        await mongoose.connect(config.DB_URL, connectOptions)
        logger.info('connected to the database successfully')

    } catch (error) {
        logger.error('Error connecting to the database', error)
        if(error instanceof Error) {
            throw(error)
        }
    }
} 


export const disconnectFromDB = async(): Promise<void> => {
    try {

        await mongoose.disconnect()
        logger.info('Disconnected from the database successfully')

    } catch (error) {
    
        logger.error('Error connecting to the database', error)
        if(error instanceof Error) {
            throw(error)
        }

    }
}