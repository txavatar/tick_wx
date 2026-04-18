const STORAGE_KEYS = {
  PLANS: 'tickwx_plans',
  HISTORY: 'tickwx_history',
  SETTINGS: 'tickwx_settings'
};

function getAllPlans() {
  const data = wx.getStorageSync(STORAGE_KEYS.PLANS);
  return data ? JSON.parse(data) : [];
}

function getPlan(id) {
  const plans = getAllPlans();
  return plans.find(p => p.id === id);
}

function savePlan(plan) {
  const plans = getAllPlans();
  const index = plans.findIndex(p => p.id === plan.id);

  if (index >= 0) {
    plans[index] = { ...plans[index], ...plan, updatedAt: Date.now() };
  } else {
    plan.createdAt = Date.now();
    plan.updatedAt = Date.now();
    plans.push(plan);
  }

  wx.setStorageSync(STORAGE_KEYS.PLANS, JSON.stringify(plans));
}

function deletePlan(id) {
  const plans = getAllPlans();
  const filtered = plans.filter(p => p.id !== id);
  wx.setStorageSync(STORAGE_KEYS.PLANS, JSON.stringify(filtered));
}

function getAllHistory() {
  const data = wx.getStorageSync(STORAGE_KEYS.HISTORY);
  if (!data) return [];

  const history = JSON.parse(data);
  return history.sort((a, b) => b.completedAt - a.completedAt);
}

function saveHistory(record) {
  const history = getAllHistory();
  history.unshift(record);

  if (history.length > 100) {
    history.splice(100);
  }

  wx.setStorageSync(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

function deleteHistory(id) {
  const history = getAllHistory();
  const filtered = history.filter(h => h.id !== id);
  wx.setStorageSync(STORAGE_KEYS.HISTORY, JSON.stringify(filtered));
}

function clearAllHistory() {
  wx.removeStorageSync(STORAGE_KEYS.HISTORY);
}

module.exports = {
  getAllPlans,
  getPlan,
  savePlan,
  deletePlan,
  getAllHistory,
  saveHistory,
  deleteHistory,
  clearAllHistory
};
