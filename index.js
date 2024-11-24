import express from 'express'
import {router} from './routes/routes.js'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import { globalLimiter } from './middleware/rateLimit.js'

const app = new express()
const port = config.port
const uploads = config.uploadFolder

//set up express
app.use(express.json())
app.set('trust proxy', config.rl_number_of_proxies)
app.use(globalLimiter)
app.disable('x-powered-by')
app.use(headers)
app.use(`/${uploads}`, express.static(uploads))
app.use('/file-upload', router)

app.listen(port, (err) => {
    console.log(`Server is listening on Port ${port}`)
    if (err) {
        console.log(err)
    }
})
