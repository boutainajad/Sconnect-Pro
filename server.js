const http = require('http');
require('dotenv').config();

const router = require('./src/core/router');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  router.lookup(req, res);
});

server.listen(PORT, () => {
  console.log('Serveur demarre sur http://localhost:' + PORT);
});