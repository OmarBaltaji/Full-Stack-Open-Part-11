const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  // console.log(error.name, error.message)

  if(error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error : 'Validation Error: ' + error.message })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}