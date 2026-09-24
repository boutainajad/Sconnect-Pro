const ejs = require('ejs');
const path = require('path');

const VIEWS_DIR = path.join(__dirname, '../../views');

async function renderError(res, code, title, message) {
  try {
    const html = await ejs.renderFile(path.join(VIEWS_DIR, 'error.ejs'), {
      code,
      title,
      message
    });
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>' + code + ' - ' + title + '</h1><p>' + message + '</p>');
  }
}

async function notFound(res) {
  await renderError(res, 404, 'Page introuvable', 'La page demandee n\'existe pas.');
}

async function serverError(res, err) {
  console.error('Erreur serveur :', err.message);
  await renderError(res, 500, 'Erreur serveur', 'Une erreur interne est survenue.');
}

module.exports = { renderError, notFound, serverError };