const bodyParser = require('body-parser');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

function parseBody(req, res, next) {
  const contentType = req.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    return jsonParser(req, res, next);
  }

  return urlencodedParser(req, res, next);
}

module.exports = parseBody;