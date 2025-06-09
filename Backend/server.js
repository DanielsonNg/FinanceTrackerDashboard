const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json({ limit: '50mb' }))

app.use(express.urlencoded({ extended: false }))

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}))

app.use(cookieParser())

const port = process.env.PORT || 3333

const router = require('./routes/routes')

app.use('/api', router)
mongoose.connect(process.env.MONGO_DB_CONNECTION)
    .then(() => {
        console.log("Connected to Database")
        app.listen(port, () => {
            console.log(`Node.js HTTP server is running on port ${port}`)
        })

    })
    .catch((err) => {
        console.log("Connection Failed")
        console.log(err)
    })