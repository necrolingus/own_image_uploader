import express from 'express'
import { config } from '../controller/config.js'

const uiRouter = express.Router()

uiRouter.get('/', async function (req, res) {
    const deleteAfterDaysMax = config.deleteAfterDaysMax || 100
    res.render('home', { deleteAfterDaysMax });
})

export { uiRouter }