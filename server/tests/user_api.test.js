const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const helpers = require('./test_helper.js');
const assert = require('assert');

const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});

  const rootUser = {
    username: 'root',
    name: 'root',
    password: 'password'
  };

  const response = await api
  .post('/api/users')
  .send(rootUser);
})

describe('When only one user in database', () => {
  test('success when adding a new user', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'omar',
      name: 'omar',
      password: 'password'
    };

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);
      
    const usersAtEnd = await helpers.usersInDB();
    assert.strictEqual(usersAtEnd, usersAtStart.length + 1);
  })

  test('fails when adding user with an existing username', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'password'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })

  test('fails when password is less than 3 characters', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      username: 'omar2',
      name: 'omar2',
      password: '12'
    };

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('`password` is shorter than the minimum allowed length (3)');

    const usersAtEnd = await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })

  test('fails when username or password is not provided', async () => {
    const usersAtStart = await helpers.usersInDB();

    const newUser = {
      name: 'omar3',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    expect(result.body.error).toContain('Please provide the ');

    const usersAtEnd =  await helpers.usersInDB();
    expect(usersAtEnd).toEqual(usersAtStart);
  })
})

afterAll(async () => {
  await mongoose.connection.close()
});