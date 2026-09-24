const pool = require('../config/db');
const render = require('../core/renderer');
const { calculateFinalPrice, generateInstallments } = require('../services/pricingService');

async function show(req, res) {
  const actRes = await pool.query(
    'SELECT a.*, f.name AS facility_name FROM activities a LEFT JOIN facilities f ON f.id = a.facility_id WHERE a.id = $1',
    [1] 
  );

  if (actRes.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Activite introuvable</h1>');
  }

  const activity = actRes.rows[0];

  const memRes = await pool.query(
    'SELECT m.*, f.quotient_familial, f.is_resident FROM members m LEFT JOIN families f ON f.id = m.family_id WHERE m.id = $1',
    [1]
  );

  if (memRes.rows.length === 0) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end('<h1>404 - Adherent introuvable</h1>');
  }

  const member = memRes.rows[0];

  const basePrice = parseFloat(activity.base_price);
  const isResident = member.is_resident === true;
  const qf = parseFloat(member.quotient_familial);
  const familyRank = 2; // exemple
  const hasPassSport = false; // exemple

  const afterResident = isResident ? basePrice : basePrice * 1.35;
  const residentDiff = afterResident - basePrice;

  const afterFamily = familyRank === 1 ? afterResident : (familyRank === 2 ? afterResident * 0.85 : afterResident * 0.70);
  const familyDiff = afterFamily - afterResident;

  const afterQF = qf < 600 ? afterFamily * 0.60 : (qf <= 900 ? afterFamily * 0.80 : afterFamily);
  const qfDiff = afterQF - afterFamily;

  const afterPass = hasPassSport ? Math.max(afterQF - 50, 0) : afterQF;
  const passDiff = afterPass - afterQF;

  const finalPrice = calculateFinalPrice({
    basePrice, isResident, familyRank, quotientFamilial: qf, hasPassSport
  });

  const installments = generateInstallments(finalPrice);

  await render(res, 'pages/checkout', {
    title: 'Devis',
    activity,
    member,
    details: {
      basePrice,
      residentDiff,
      familyDiff,
      qfDiff,
      passDiff,
      finalPrice
    },
    installments
  });
}

module.exports = { show };