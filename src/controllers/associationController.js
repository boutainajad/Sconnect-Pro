const pool = require('../config/db');
const render = require('../core/renderer');

async function list(req, res) {
  const result = await pool.query('SELECT * FROM associations ORDER BY id');
  await render(res, 'pages/associations', {
    title: 'Associations',
    associations: result.rows
  });
}

async function newForm(req, res) {
  await render(res, 'pages/association-form', {
    title: 'Nouvelle association',
    association: null
  });
}

async function create(req, res) {
  const { name, contact_name, phone, email } = req.body;

  await pool.query(
    `INSERT INTO associations (name, contact_name, phone, email)
     VALUES ($1, $2, $3, $4)`,
    [name, contact_name, phone, email]
  );

  res.writeHead(302, { Location: '/associations' });
  res.end();
}

async function detail(req, res, params) {
  const result = await pool.query(
    'SELECT * FROM associations WHERE id = $1',
    [params.id]
  );

  if (result.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Association introuvable</h1>');
  }

  await render(res, 'pages/association-detail', {
    title: 'Detail association',
    association: result.rows[0]
  });
}

module.exports = { list, newForm, create, detail };