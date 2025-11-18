import express from 'express'
import config from '@/config'

const app = express()

app.get('/', (req, res) => {
    res.status(200).json({message: "server is up"})
})

app.listen(config.PORT, ()=> {
    console.log("server running on port 3000")
})