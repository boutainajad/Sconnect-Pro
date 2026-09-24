const pool = require('../config/db');
const render = require('../core/renderer');
const { findConflict, checkCapacity } = require('../services/scheduleService');

async function list(req, res) {
  const result = await pool.query(`
    SELECT a.*, f.name AS facility_name, ass.name AS association_name
    FROM activities a
    LEFT JOIN facilities f ON f.id = a.facility_id
    LEFT JOIN associations ass ON ass.id = a.association_id
    ORDER BY a.id
  `);

  await render(res, 'pages/activities', {
    title: 'Activites',
    activities: result.rows
  });
}

async function newForm(req, res, params, query) {
  const facilities = await pool.query('SELECT id, name, erp_capacity FROM facilities ORDER BY id');
  const associations = await pool.query('SELECT id, name FROM associations ORDER BY id');

  await render(res, 'pages/activity-form', {
    title: 'Nouvelle activite',
    facilities: facilities.rows,
    associations: associations.rows,
    error: query && query.error ? decodeURIComponent(query.error) : null
  });
}

async function create(req, res) {
  const {
    name, association_id, facility_id, zone, base_price,
    max_capacity, day_of_week, start_time, end_time,
    age_category, is_all_public, is_risk_sport
  } = req.body;

  const facRes = await pool.query(
    'SELECT id, name, erp_capacity FROM facilities WHERE id = $1',
    [facility_id]
  );

  if (facRes.rows.length === 0) {
    res.writeHead(302, { Location: '/activities/new?error=' + encodeURIComponent('Salle introuvable') });
    return res.end();
  }

  const facility = facRes.rows[0];

  const capCheck = checkCapacity({ max_capacity: parseInt(max_capacity, 10) }, facility);
  if (!capCheck.valid) {
    res.writeHead(302, { Location: '/activities/new?error=' + encodeURIComponent(capCheck.message) });
    return res.end();
  }

  const existing = await pool.query(
    'SELECT * FROM activities WHERE facility_id = $1 AND day_of_week = $2',
    [facility_id, day_of_week]
  );

  const newActivity = {
    day_of_week,
    start_time,
    end_time,
    facility_id: parseInt(facility_id, 10),
    zone: zone || 'full'
  };

  const conflict = findConflict(newActivity, existing.rows);
  if (conflict) {
    const msg = 'Conflit avec activite "' + conflict.name + '" (' + conflict.start_time + ' - ' + conflict.end_time + ')';
    res.writeHead(302, { Location: '/activities/new?error=' + encodeURIComponent(msg) });
    return res.end();
  }

  await pool.query(
    `INSERT INTO activities
     (name, association_id, facility_id, zone, base_price, max_capacity,
      day_of_week, start_time, end_time, age_category, is_all_public, is_risk_sport)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      name,
      association_id || null,
      facility_id,
      zone || 'full',
      parseFloat(base_price),
      parseInt(max_capacity, 10),
      day_of_week,
      start_time,
      end_time,
      age_category || 'Tous',
      is_all_public === 'on',
      is_risk_sport === 'on'
    ]
  );

  res.writeHead(302, { Location: '/activities' });
  res.end();
}

async function detail(req, res, params) {
  const result = await pool.query(`
    SELECT a.*, f.name AS facility_name, ass.name AS association_name
    FROM activities a
    LEFT JOIN facilities f ON f.id = a.facility_id
    LEFT JOIN associations ass ON ass.id = a.association_id
    WHERE a.id = $1
  `, [params.id]);

  if (result.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Activite introuvable</h1>');
  }

  const activity = result.rows[0];

  const countRes = await pool.query(
    "SELECT COUNT(*) AS total FROM registrations WHERE activity_id = $1 AND status = 'confirmed'",
    [params.id]
  );

  activity.confirmed_count = parseInt(countRes.rows[0].total, 10);

  await render(res, 'pages/activity-detail', {
    title: 'Detail activite',
    activity
  });
}

module.exports = { list, newForm, create, detail };