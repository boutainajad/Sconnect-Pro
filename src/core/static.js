const path = require('path');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');

const serve = serveStatic(path.join(__dirname, '../../public'), {
  index: false,
  setHeaders: (res, filePath) => {
    console.log('Fichier servi :', filePath);
  }
});

function staticHandler(req, res) {
  const done = finalhandler(req, res);
  serve(req, res, done);
}

module.exports = staticHandler;