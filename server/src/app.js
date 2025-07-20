const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const personsRouter = require('./controllers/persons')
const { unknownEndpoint, errorHandler } = require('./utils/middelware')
const path = require('path')

morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())
app.use('/', express.static(path.join(__dirname, '../../client/build')));

app.use('/api/persons', personsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app