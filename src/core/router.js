// src/core/router.js
const Router = require('find-my-way');

const router = Router({
  defaultRoute: (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Page introuvable</h1>');
  }
});

// Route : Accueil
router.on('GET', '/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Accueil - SportConnect Pro</h1>');
});

// Route : Activités
router.on('GET', '/activities', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Liste des activites</h1>');
});

// Route : Adhérents
router.on('GET', '/members', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Liste des adherents</h1>');
});

// Route : Salles
router.on('GET', '/facilities', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Liste des salles</h1>');
});

// Route dynamique : /activities/:id
router.on('GET', '/activities/:id', (req, res, params) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Activite numero ' + params.id + '</h1>');
});

module.exports = router;