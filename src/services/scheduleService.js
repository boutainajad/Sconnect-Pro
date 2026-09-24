function isOverlap(a, b) {
  if (a.day_of_week !== b.day_of_week) return false;
  if (a.facility_id !== b.facility_id) return false;
  if (a.zone !== b.zone && a.zone !== 'full' && b.zone !== 'full') return false;
  return a.start_time < b.end_time && b.start_time < a.end_time;
}

function findConflict(newActivity, existingActivities) {
  for (const act of existingActivities) {
    if (act.id === newActivity.id) continue;
    if (isOverlap(newActivity, act)) return act;
  }
  return null;
}

function checkCapacity(activity, facility) {
  if (activity.max_capacity > facility.erp_capacity) {
    return { valid: false, message: 'Capacite depasse la jauge ERP' };
  }
  return { valid: true };
}

module.exports = { isOverlap, findConflict, checkCapacity };