const http = require('http');
require('dotenv').config();

require('./src/config/db');

const router = require('./src/core/router');
const staticHandler = require('./src/core/static');
const parseBody = require('./src/core/bodyParser');
const { serverError } = require('./src/core/errorHandler');

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith('/css/') ||
        req.url.startsWith('/js/') ||
        req.url.startsWith('/images/')) {
      return staticHandler(req, res);
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      return parseBody(req, res, () => {
        router.lookup(req, res);
      });
    }

    router.lookup(req, res);
  } catch (err) {
    await serverError(res, err);
  }
});

server.listen(PORT, () => {
  console.log('Serveur demarre sur http://localhost:' + PORT);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception :', err.message);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection :', err.message);
});