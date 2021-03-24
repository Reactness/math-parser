import express from 'express'
const  mathController = require('./controllers/math.controller')

const app = express();
const port = 5000;

app.use(express.json()) 

app.use('/data', mathController)
app.listen(port, () => console.log(`Running on port ${port}`));