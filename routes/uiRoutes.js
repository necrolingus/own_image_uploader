import express from 'express'

const uiRouter = express.Router()

uiRouter.get('/', async function(req, res) {
    res.render('home');
})

export {uiRouter}