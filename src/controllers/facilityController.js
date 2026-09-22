const pool = require('../config/db');
const render = require('../core/renderer');

async function list(req, res) {
  const result = await pool.query('SELECT * FROM facilities ORDER BY id');
  await render(res, 'pages/facilities', {
    title: 'Salles',
    facilities: result.rows
  });
}

async function newForm(req, res) {
  await render(res, 'pages/facility-form', {
    title: 'Nouvelle salle',
    facility: null
  });
}

async function create(req, res) {
  const { name, type, address, erp_capacity, is_divisible } = req.body;

  await pool.query(
    `INSERT INTO facilities (name, type, address, erp_capacity, is_divisible)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, type, address, parseInt(erp_capacity, 10), is_divisible === 'on']
  );

  res.writeHead(302, { Location: '/facilities' });
  res.end();
}

async function detail(req, res, params) {
  const result = await pool.query(
    'SELECT * FROM facilities WHERE id = $1',
    [params.id]
  );

  if (result.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Salle introuvable</h1>');
  }

  await render(res, 'pages/facility-detail', {
    title: 'Detail salle',
    facility: result.rows[0]
  });
}

module.exports = { list, newForm, create, detail };