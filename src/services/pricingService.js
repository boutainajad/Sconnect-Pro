
function applyResidentRate(basePrice, isResident) {
  if (isResident) return basePrice;
  return basePrice * 1.35;
}

function applyFamilyDiscount(price, rank) {
  if (rank === 1) return price;
  if (rank === 2) return price * 0.85;
  return price * 0.70;
}

function applyQuotientDiscount(price, qf) {
  if (qf < 600) return price * 0.60;
  if (qf <= 900) return price * 0.80;
  return price;
}

function applyPassSport(price, hasPassSport) {
  if (!hasPassSport) return price;
  return Math.max(price - 50, 0);
}

function applyFloor(price) {
  return Math.max(price, 15);
}

function calculateFinalPrice({ basePrice, isResident, familyRank, quotientFamilial, hasPassSport }) {
  let price = basePrice;

  price = applyResidentRate(price, isResident);
  price = applyFamilyDiscount(price, familyRank);
  price = applyQuotientDiscount(price, quotientFamilial);
  price = applyPassSport(price, hasPassSport);
  price = applyFloor(price);

  price = Math.round(price * 100) / 100;

  return price;
}

function generateInstallments(total) {
  const e1 = Math.round(total * 0.40 * 100) / 100;
  const e2 = Math.round(total * 0.30 * 100) / 100;
  const e3 = Math.round((total - e1 - e2) * 100) / 100;
  return [e1, e2, e3];
}

module.exports = {
  applyResidentRate,
  applyFamilyDiscount,
  applyQuotientDiscount,
  applyPassSport,
  applyFloor,
  calculateFinalPrice,
  generateInstallments
};