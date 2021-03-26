require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Phonebook = require('./models/phonebook')

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', async (request, response, next) => {
  try {
    const contacts = await Phonebook.find({})
    response.json(contacts)
  } catch (error) {
    next(error)
  }
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const personResult = await Phonebook.findById(id)
    if (personResult) {
      response.json(personResult)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const deletePerson = await Phonebook.findByIdAndRemove(id)
    if (deletePerson) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

app.post('/api/persons', async (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'Name is required in request body.'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number is required in request body.'
    })
  }

  const duplicate = await Phonebook.findOne({ 'name': body.name })
  if (duplicate) {
    return response.status(400).json({
      error: `${body.name} is already in the phonebook.`
    })
  }

  try {
    const person = new Phonebook({
      name: body.name,
      number: body.number,
      id: generateId(),
    })
    const newContact = await person.save()
    return response.json(newContact)
  } catch (error) {
    next(error)
  }
})

app.put('/api/persons/:id', async (request, response, next) => {
  try {
    const body = request.body

    const person = {
      name: body.name,
      number: body.number,
    }

    const updatedPerson = await Phonebook.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    return response.json(updatedPerson)
  } catch (error) {
    next(error)
  }
})

app.get('/info', async (request, response, next) => {
  try {
    const phonebookLength = await Phonebook.count({})
    response.send(`<p>Phonebook has info for ${phonebookLength} people</p> <br>${ new Date()}<p>`)
  } catch (error) {
    next(error)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()))
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/health', (req, res) => {
  res.send('ok')
})