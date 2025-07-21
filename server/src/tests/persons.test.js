const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose');
const Person = require('../models/person');
const timeout = 10000;

const initialPersons = [
   {
    name: 'test user 1',
    number: '213-120391'
  },
  {
    name: 'test user 2',
    number: '213-125511'
  },
  {
    name: 'test user 3',
    number: '213-120645'
  },
];

const personsInDB = async () => {
  const persons = await Person.find({});
  return persons.map(person => person.toJSON());
}

describe('persons api', () => {
  beforeEach(async () => {
    await Person.deleteMany({});

    const persons = initialPersons.map(person => new Person(person));
    const promiseArray = persons.map(p => p.save());
    await Promise.all(promiseArray);
  })

  describe('when there is initially some persons saved', () => {
    test('persons returned in JSON and correct amount', async () => {
      const response = await api.get('/api/persons')
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      expect(response.body).toHaveLength(initialPersons.length);
    }, timeout)
  
    test('unique identifier be id', async () => {
      const response = await api.get('/api/persons');
      expect(response.body[0].id).toBeDefined();
    }, timeout);
  })

  describe('adding a person', () => {
    test('a valid person can be added', async () => {
      const person = {
        name: 'test user 4',
        number: '213-99999',
      }

      await api.post('/api/persons')
        .send(person)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const persons = await personsInDB();
      expect(persons).toHaveLength(initialPersons.length + 1)

      const names = persons.map(p => p.name);
      expect(names).toContain(person.name);

      const numbers = persons.map(p => p.number);
      expect(numbers).toContain(person.number);
    })

    test('person with missing properties not added', async () => {
      const person = {
        name: 'test user 4',
      }

      await api.post('/api/persons')
        .send(person)
        .expect(400)

      const persons = await personsInDB();
      expect(persons).toHaveLength(initialPersons.length)
    })

    test('person with number with length less than 8 not added', async () => {
      const person = {
        name: 'test user 4',
        number: '999'
      }

      const response = await api.post('/api/persons')
        .send(person)
        .expect(400)

      const persons = await personsInDB();
      expect(persons).toHaveLength(initialPersons.length)
    })
  })

  describe('deletion of person', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      let persons = await personsInDB()
      const firstPerson = persons[0]

      await api
        .delete(`/api/persons/${firstPerson.id}`)
        .expect(204)
      
      persons = await personsInDB();
      expect(persons).toHaveLength(initialPersons.length - 1)

      const names = persons.map(p => p.name)
      expect(names).not.toContain(firstPerson.name)
    })
  })

  describe('updating a person', () => {
    test('succeeds with updating a person if id and body are valid', async () => {
      const persons = await personsInDB();
      const firstPerson = persons[0]
      const modifiedProperties = {
        number: '123-9999999'
      }

      const response = await api
        .put(`/api/persons/${firstPerson.id}`)
        .send(modifiedProperties)
        .expect(200)

      const updatedPerson = {
        ...response.body,
        ...modifiedProperties
      }

      expect(response.body).toEqual(updatedPerson)
    })
  })

  describe('getting phonebook info', () => {
    test('returns count of persons', async () => {
      const response = await api.get('/api/persons/info')
        .expect(200)
        .expect('Content-Type', /text\/html/)

      const persons = await personsInDB();
      const entries = `Phonebook has info for ${persons.length} people`
      expect(response.text).toContain(`<div>${entries}</div><br>`)
    })
  })

  describe('getting a single person', () => {
    test('returns person if found', async () => {
      const persons = await personsInDB();
      const firstPerson = persons[0]

      const response = await api.get(`/api/persons/${firstPerson.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toStrictEqual(firstPerson)
    })
  })
})

afterAll(async() => {
  await mongoose.connection.close()
})