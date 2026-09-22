// src/core/router.js
const Router = require('find-my-way');
const render = require('./renderer');
const facilityController = require('../controllers/facilityController');
const associationController = require('../controllers/associationController');
const memberController = require('../controllers/memberController');

const router = Router({
  defaultRoute: (req, res) => {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404 - Page introuvable</h1>');
  }
});

// ============================================
// ACCUEIL
// ============================================

router.on('GET', '/', async (req, res) => {
  await render(res, 'pages/dashboard', {
    title: 'Accueil',
    userName: 'Youssef',
    activitiesCount: 4,
    membersCount: 5
  });
});

// ============================================
// FACILITIES (Salles)
// ============================================

router.on('GET', '/facilities', facilityController.list);
router.on('GET', '/facilities/new', facilityController.newForm);
router.on('POST', '/facilities', facilityController.create);
router.on('GET', '/facilities/:id', facilityController.detail);

// ============================================
// ASSOCIATIONS (Clubs)
// ============================================

router.on('GET', '/associations', associationController.list);
router.on('GET', '/associations/new', associationController.newForm);
router.on('POST', '/associations', associationController.create);
router.on('GET', '/associations/:id', associationController.detail);

// ============================================
// MEMBERS (Adherents)
// ============================================

router.on('GET', '/members', memberController.list);
router.on('GET', '/members/new', memberController.newForm);
router.on('POST', '/members', memberController.create);
router.on('GET', '/members/:id', memberController.detail);

// ============================================
// ACTIVITES (temporaire)
// ============================================

router.on('GET', '/activities', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Liste des activites</h1>');
});

router.on('GET', '/activities/:id', (req, res, params) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Activite numero ' + params.id + '</h1>');
});

// ============================================
// FORMULAIRE TEST
// ============================================

router.on('GET', '/form', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Formulaire</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <h1>Test formulaire POST</h1>
      <form method="POST" action="/members">
        <input type="text" name="name" placeholder="Nom" required>
        <input type="number" name="age" placeholder="Age" required>
        <button type="submit">Envoyer</button>
      </form>
    </body>
    </html>
  `);
});

module.exports = router;