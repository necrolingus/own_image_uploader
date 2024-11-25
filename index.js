import express from 'express'
import {router} from './routes/routes.js'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import { globalLimiter } from './middleware/rateLimit.js'
import {startFileCleanup} from './controller/delete_expired_files.js'

const app = new express()
const port = config.port
const uploads = config.uploadFolder

// Middleware to parse form data before multer handles files
app.use(express.urlencoded({ extended: true }));

//handle x-forwarded-for header and other security stuff
app.set('trust proxy', config.rl_number_of_proxies)
app.use(globalLimiter)
app.disable('x-powered-by')
app.use(headers)

//set uploads for as static
app.use(`/${uploads}`, express.static(uploads))

//set router 
app.use('/api', router)

//start the cleanup function
startFileCleanup(6 * 60 * 60 * 1000); // 6 hours in milliseconds

//start express
app.listen(port, (err) => {
    console.log(`Server is listening on Port ${port}`)
    if (err) {
        console.log(err)
    }
})
