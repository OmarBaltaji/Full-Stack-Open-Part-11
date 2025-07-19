const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGODB_URI } = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);

logger.info('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI).then(() => {
  logger.info('Connected to MongoDB')
}).catch(error => {
  logger.error('Failed to connect to MongoDB:', error.message)
})

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());

app.use(middleware.requesterLogger);
app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;