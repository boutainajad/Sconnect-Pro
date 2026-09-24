// src/services/waitingListService.js
const pool = require('../config/db');

async function addToWaitingList(client, activityId, memberId, isResident) {
  const priorityScore = isResident ? 10 : 0;

  const result = await client.query(
    `INSERT INTO waiting_list (activity_id, member_id, priority_score, status)
     VALUES ($1, $2, $3, 'waiting')
     RETURNING *`,
    [activityId, memberId, priorityScore]
  );

  return result.rows[0];
}

async function promoteNext(client, activityId) {
  const countRes = await client.query(
    `SELECT COUNT(*) AS total FROM registrations
     WHERE activity_id = $1 AND status = 'confirmed'`,
    [activityId]
  );

  const actRes = await client.query(
    'SELECT max_capacity FROM activities WHERE id = $1',
    [activityId]
  );

  const currentCount = parseInt(countRes.rows[0].total, 10);
  const maxCapacity = actRes.rows[0].max_capacity;

  if (currentCount >= maxCapacity) return null;

  const nextRes = await client.query(
    `SELECT w.*, m.family_id, f.is_resident, f.quotient_familial
     FROM waiting_list w
     JOIN members m ON m.id = w.member_id
     LEFT JOIN families f ON f.id = m.family_id
     WHERE w.activity_id = $1 AND w.status = 'waiting'
     ORDER BY w.priority_score DESC, w.created_at ASC
     LIMIT 1
     FOR UPDATE`,
    [activityId]
  );

  if (nextRes.rows.length === 0) return null;

  const next = nextRes.rows[0];

  await client.query(
    `UPDATE waiting_list
     SET status = 'promoted_pending',
         deadline_confirmation = NOW() + INTERVAL '48 hours'
     WHERE id = $1`,
    [next.id]
  );

  return next;
}

async function confirmPromotion(client, waitingId, finalPrice) {
  const waitRes = await client.query(
    'SELECT * FROM waiting_list WHERE id = $1 AND status = $2',
    [waitingId, 'promoted_pending']
  );

  if (waitRes.rows.length === 0) {
    throw new Error('Promotion introuvable ou expiree');
  }

  const wait = waitRes.rows[0];

  const regRes = await client.query(
    `INSERT INTO registrations (member_id, activity_id, final_price, status, payment_type)
     VALUES ($1, $2, $3, 'confirmed', 'full')
     RETURNING *`,
    [wait.member_id, wait.activity_id, finalPrice]
  );

  await client.query(
    `UPDATE waiting_list SET status = 'confirmed' WHERE id = $1`,
    [waitingId]
  );

  return regRes.rows[0];
}

async function expirePromotions(client) {
  const result = await client.query(
    `UPDATE waiting_list
     SET status = 'expired'
     WHERE status = 'promoted_pending'
       AND deadline_confirmation < NOW()
     RETURNING *`
  );
  return result.rows;
}

module.exports = {
  addToWaitingList,
  promoteNext,
  confirmPromotion,
  expirePromotions
};