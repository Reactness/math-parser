import express from 'express'
import * as mathService from './../services/math.service'
const router = express.Router()

router
    .post('/', mathService.calculateExpressions)

module.exports = router