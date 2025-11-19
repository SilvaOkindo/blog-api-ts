import {rateLimit} from 'express-rate-limit'

const limiter = rateLimit({
    windowMs: 60000,
    limit: 3,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: "You have sent too many request in a given time."
    }
})

export default limiter