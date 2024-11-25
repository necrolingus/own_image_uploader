import express from 'express'
import {engine} from 'express-handlebars'
import {router} from './routes/routes.js'
import {uiRouter} from './routes/uiRoutes.js'
import {config} from './controller/config.js'
import {headers} from './middleware/headers.js'
import {globalLimiter} from './middleware/rateLimit.js'
import {startFileCleanup} from './controller/delete_expired_files.js'

const app = new express()
const port = config.port
const uploads = config.uploadFolder

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//handle x-forwarded-for header and other security stuff
app.set('trust proxy', config.rl_number_of_proxies)
app.use(globalLimiter)
app.disable('x-powered-by')
app.use(headers)

//set uploads folder as static and the static folder for the ui
app.use(`/${uploads}`, express.static(uploads))
app.use(express.static('public'));

//set api router 
app.use('/api', router)

//express-handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use('/ui', uiRouter);

//start the cleanup function
startFileCleanup(6 * 60 * 60 * 1000); // 6 hours in milliseconds

//start express
app.listen(port, (err) => {
    console.log(`Server is listening on Port ${port}`)
    if (err) {
        console.log(err)
    }
})
