const pool = require('../config/db');
const render = require('../core/renderer');
const { computeAge, getAgeCategory, checkMedicalCertificate } = require('../services/eligibilityService');

async function list(req, res) {
  const result = await pool.query(`
    SELECT m.*, f.family_code
    FROM members m
    LEFT JOIN families f ON f.id = m.family_id
    ORDER BY m.id
  `);

  const members = result.rows.map(m => ({
    ...m,
    age: computeAge(m.birth_date),
    category: getAgeCategory(m.birth_date)
  }));

  await render(res, 'pages/members', {
    title: 'Adherents',
    members
  });
}

// FORMULAIRE
async function newForm(req, res) {
  const fams = await pool.query('SELECT id, family_code FROM families ORDER BY id');

  await render(res, 'pages/member-form', {
    title: 'Nouvel adherent',
    member: null,
    families: fams.rows
  });
}

async function create(req, res) {
  const { first_name, last_name, birth_date, email, phone, medical_certificate_date, family_id } = req.body;

  const medical_status = checkMedicalCertificate(medical_certificate_date, false);

  await pool.query(
    `INSERT INTO members
     (first_name, last_name, birth_date, email, phone, medical_certificate_date, medical_status, family_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      first_name,
      last_name,
      birth_date,
      email,
      phone,
      medical_certificate_date || null,
      medical_status,
      family_id ? parseInt(family_id, 10) : null
    ]
  );

  res.writeHead(302, { Location: '/members' });
  res.end();
}


async function detail(req, res, params) {
  const result = await pool.query(
    'SELECT * FROM members WHERE id = $1',
    [params.id]
  );

  if (result.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Adherent introuvable</h1>');
  }

  const member = {
    ...result.rows[0],
    age: computeAge(result.rows[0].birth_date),
    category: getAgeCategory(result.rows[0].birth_date)
  };

  await render(res, 'pages/member-detail', {
    title: 'Detail adherent',
    member
  });
}

module.exports = { list, newForm, create, detail };