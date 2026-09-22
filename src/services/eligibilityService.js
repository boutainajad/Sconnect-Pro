
function computeAge(birthDate, seasonEnd = new Date()) {
  const birth = new Date(birthDate);
  const ref = new Date(seasonEnd);
  let age = ref.getFullYear() - birth.getFullYear();
  const m = ref.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && ref.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function getAgeCategory(birthDate) {
  const age = computeAge(birthDate);

  if (age < 6)  return 'Baby';
  if (age <= 8) return 'U9';
  if (age <= 10) return 'U11';
  if (age <= 12) return 'U13';
  if (age <= 14) return 'U15';
  if (age <= 17) return 'U18';
  if (age <= 39) return 'Senior';
  return 'Veteran';
}

// Verifier certificat medical
function checkMedicalCertificate(certDate, isRiskSport = false) {
  if (!certDate) return 'medical_non_compliant';

  const cert = new Date(certDate);
  const now = new Date();
  const yearsDiff = (now - cert) / (1000 * 60 * 60 * 24 * 365);

  if (isRiskSport && yearsDiff > 1) return 'medical_non_compliant';
  if (!isRiskSport && yearsDiff > 3) return 'medical_non_compliant';

  return 'valid';
}

function isAgeEligible(birthDate, activityAgeCategory, isAllPublic) {
  if (isAllPublic) return true;
  const cat = getAgeCategory(birthDate);
  return cat === activityAgeCategory;
}

module.exports = {
  computeAge,
  getAgeCategory,
  checkMedicalCertificate,
  isAgeEligible
};