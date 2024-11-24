import express from 'express'
import {router} from './routes/routes.js'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'

const app = new express()
const port = config.port
const uploads = config.uploadFolder

app.disable('x-powered-by');
app.use(express.json());
app.use(headers);
app.use('/file-upload', router)
app.use(`/${uploads}`, express.static(uploads));

app.listen(port, (err) => {
    console.log(`Server is listening on Port ${port}`)
    if (err) {
        console.log(err)
    }
})
