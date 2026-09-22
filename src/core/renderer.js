// src/core/renderer.js
const ejs = require('ejs');
const path = require('path');

const VIEWS_DIR = path.join(__dirname, '../../views');

async function render(res, viewName, data = {}) {
  const filePath = path.join(VIEWS_DIR, viewName + '.ejs');
  try {
    const html = await ejs.renderFile(filePath, data);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    console.error('Erreur EJS :', err.message);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - Erreur serveur</h1>');
  }
}

module.exports = render;