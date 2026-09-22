const http = require('http');
require('dotenv').config();

const router = require('./src/core/router');
const staticHandler = require('./src/core/static');
const parseBody = require('./src/core/bodyParser');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // 1. Fichiers statiques
  if (req.url.startsWith('/css/') ||
      req.url.startsWith('/js/') ||
      req.url.startsWith('/images/')) {
    return staticHandler(req, res);
  }

  // 2. Parser le body pour POST/PUT
  if (req.method === 'POST' || req.method === 'PUT') {
    return parseBody(req, res, () => {
      router.lookup(req, res);
    });
  }

  // 3. Sinon router
  router.lookup(req, res);
});

server.listen(PORT, () => {
  console.log('Serveur demarre sur http://localhost:' + PORT);
});