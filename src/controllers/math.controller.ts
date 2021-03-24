import express from 'express'
import * as mathService from './../services/math.service'
const router = express.Router()

router
    .post('/data', mathService.calculateExpressions)
    .get('/result', mathService.getResults)

module.exports = router