const pool = require('../config/db');
const render = require('../core/renderer');
const { confirmPromotion } = require('../services/waitingListService');
const { calculateFinalPrice } = require('../services/pricingService');

async function list(req, res) {
  const result = await pool.query(`
    SELECT w.*, m.first_name, m.last_name, a.name AS activity_name
    FROM waiting_list w
    JOIN members m ON m.id = w.member_id
    JOIN activities a ON a.id = w.activity_id
    ORDER BY w.created_at DESC
  `);

  await render(res, 'pages/waiting-list', {
    title: "File d'attente",
    entries: result.rows
  });
}

async function confirm(req, res, params) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const waitRes = await client.query(
      `SELECT w.*, a.base_price, m.family_id, f.is_resident, f.quotient_familial
       FROM waiting_list w
       JOIN activities a ON a.id = w.activity_id
       JOIN members m ON m.id = w.member_id
       LEFT JOIN families f ON f.id = m.family_id
       WHERE w.id = $1`,
      [params.id]
    );

    if (waitRes.rows.length === 0) {
      await client.query('ROLLBACK');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 - Promotion introuvable</h1>');
    }

    const wait = waitRes.rows[0];

    const finalPrice = calculateFinalPrice({
      basePrice: parseFloat(wait.base_price),
      isResident: wait.is_resident === true,
      familyRank: 1,
      quotientFamilial: parseFloat(wait.quotient_familial || 1000),
      hasPassSport: false
    });

    await confirmPromotion(client, params.id, finalPrice);

    await client.query('COMMIT');
    res.writeHead(302, { Location: '/waiting-list' });
    res.end();
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err.message);
    res.writeHead(500).end();
  } finally {
    client.release();
  }
}

module.exports = { list, confirm };