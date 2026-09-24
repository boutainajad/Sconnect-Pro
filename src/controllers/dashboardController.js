const pool = require('../config/db');
const render = require('../core/renderer');

async function show(req, res) {
  const counts = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM members) AS members,
      (SELECT COUNT(*) FROM facilities) AS facilities,
      (SELECT COUNT(*) FROM associations) AS associations,
      (SELECT COUNT(*) FROM activities) AS activities,
      (SELECT COUNT(*) FROM registrations WHERE status = 'confirmed') AS registrations,
      (SELECT COUNT(*) FROM waiting_list WHERE status = 'waiting') AS waiting,
      (SELECT COALESCE(SUM(final_price), 0) FROM registrations WHERE status = 'confirmed') AS revenue
  `);

  const stats = counts.rows[0];

  const activities = await pool.query(`
    SELECT
      a.id, a.name, a.max_capacity,
      COUNT(r.id) FILTER (WHERE r.status = 'confirmed') AS confirmed_count,
      ROUND(
        (COUNT(r.id) FILTER (WHERE r.status = 'confirmed')::numeric / a.max_capacity) * 100, 1
      ) AS fill_rate
    FROM activities a
    LEFT JOIN registrations r ON r.activity_id = a.id
    GROUP BY a.id, a.name, a.max_capacity
    ORDER BY fill_rate DESC NULLS LAST
    LIMIT 5
  `);

  const recent = await pool.query(`
    SELECT r.id, r.final_price, r.status, r.registration_date,
           m.first_name, m.last_name, a.name AS activity_name
    FROM registrations r
    JOIN members m ON m.id = r.member_id
    JOIN activities a ON a.id = r.activity_id
    ORDER BY r.registration_date DESC
    LIMIT 5
  `);

  await render(res, 'pages/dashboard', {
    title: 'Tableau de bord',
    stats,
    activities: activities.rows,
    recent: recent.rows
  });
}

module.exports = { show };