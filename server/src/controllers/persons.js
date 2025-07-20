const Person = require('../models/person')
const personsRouter = require('express').Router()

personsRouter.get('/', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

personsRouter.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const entries = `Phonebook has info for ${count} people`
    const date = new Date()
    res.send(`<div>${entries}</div><br><div>${date}</div>`)
  })
})

personsRouter.get('/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  }).catch(error => {
    next(error)
  })
})

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(() => {
    res.status(204).end()
  }).catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  }).catch(error => next(error))
})

personsRouter.put('/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' }).then(updatedPerson => {
    res.json(updatedPerson)
  }).catch(error => next(error))
})


module.exports = personsRouter