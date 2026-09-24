const pool = require('../config/db');
const render = require('../core/renderer');
const { calculateFinalPrice } = require('../services/pricingService');
const { promoteNext } = require('../services/waitingListService');

async function list(req, res) {
  const result = await pool.query(`
    SELECT r.*, m.first_name, m.last_name, a.name AS activity_name
    FROM registrations r
    JOIN members m ON m.id = r.member_id
    JOIN activities a ON a.id = r.activity_id
    ORDER BY r.id DESC
  `);

  await render(res, 'pages/registrations', {
    title: 'Inscriptions',
    registrations: result.rows
  });
}

async function newForm(req, res) {
  const members = await pool.query('SELECT id, first_name, last_name FROM members ORDER BY id');
  const activities = await pool.query('SELECT id, name, base_price FROM activities ORDER BY id');

  await render(res, 'pages/registration-form', {
    title: 'Nouvelle inscription',
    members: members.rows,
    activities: activities.rows
  });
}

async function create(req, res) {
  const { member_id, activity_id, has_pass_sport } = req.body;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const actRes = await client.query(
      'SELECT id, name, base_price, max_capacity FROM activities WHERE id = $1 FOR UPDATE',
      [activity_id]
    );

    if (actRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 - Activite introuvable</h1>');
    }

    const activity = actRes.rows[0];

    const countRes = await client.query(
      "SELECT COUNT(*) AS total FROM registrations WHERE activity_id = $1 AND status = 'confirmed'",
      [activity_id]
    );
    const currentCount = parseInt(countRes.rows[0].total, 10);

    const memRes = await client.query(
      'SELECT m.*, f.quotient_familial, f.is_resident FROM members m LEFT JOIN families f ON f.id = m.family_id WHERE m.id = $1',
      [member_id]
    );

    if (memRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 - Adherent introuvable</h1>');
    }

    const member = memRes.rows[0];

    if (currentCount >= activity.max_capacity) {
      const priorityScore = member.is_resident ? 10 : 0;

      await client.query(
        `INSERT INTO waiting_list (activity_id, member_id, priority_score, status)
         VALUES ($1, $2, $3, 'waiting')`,
        [activity_id, member_id, priorityScore]
      );

      await client.query('COMMIT');
      res.writeHead(302, { Location: '/registrations' });
      return res.end();
    }

    const familyCount = await client.query(
      'SELECT COUNT(*) AS total FROM registrations r JOIN members m ON m.id = r.member_id WHERE m.family_id = $1',
      [member.family_id]
    );
    const familyRank = parseInt(familyCount.rows[0].total, 10) + 1;

    const finalPrice = calculateFinalPrice({
      basePrice: parseFloat(activity.base_price),
      isResident: member.is_resident === true,
      familyRank,
      quotientFamilial: parseFloat(member.quotient_familial || 1000),
      hasPassSport: has_pass_sport === 'on'
    });

    await client.query(
      `INSERT INTO registrations (member_id, activity_id, final_price, status, payment_type)
       VALUES ($1, $2, $3, 'confirmed', 'full')`,
      [member_id, activity_id, finalPrice]
    );

    await client.query('COMMIT');
    res.writeHead(302, { Location: '/registrations' });
    res.end();
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur transaction :', err.message);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - Erreur serveur</h1>');
  } finally {
    client.release();
  }
}

async function cancel(req, res, params) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const regRes = await client.query(
      'SELECT activity_id FROM registrations WHERE id = $1',
      [params.id]
    );

    if (regRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 - Inscription introuvable</h1>');
    }

    const activityId = regRes.rows[0].activity_id;

    await client.query(
      "UPDATE registrations SET status = 'cancelled' WHERE id = $1",
      [params.id]
    );

    await promoteNext(client, activityId);

    await client.query('COMMIT');
    res.writeHead(302, { Location: '/registrations' });
    res.end();
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erreur annulation :', err.message);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>500 - Erreur serveur</h1>');
  } finally {
    client.release();
  }
}

module.exports = { list, newForm, create, cancel };