const { PORT } = require('./utils/config');
const http = require('http')
const app = require('./app');
const server = http.createServer(app);
const logger = require('./utils/logger');

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})