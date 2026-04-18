const app = getApp();
const storage = require('../../utils/storage.js');
const presets = require('../../constants/presets.js');

Page({
  data: {
    lastPlan: null
  },

  onLoad() {
    this.loadLastPlan();
  },

  onShow() {
    this.loadLastPlan();
  },

  loadLastPlan() {
    const lastPlanId = app.globalData.lastPlanId;
    if (lastPlanId) {
      const plan = storage.getPlan(lastPlanId);
      if (plan) {
        this.setData({ lastPlan: plan });
      }
    }
  },

  startLastPlan() {
    if (this.data.lastPlan) {
      wx.navigateTo({
        url: `/pages/timer/timer?planId=${this.data.lastPlan.id}`
      });
    }
  },

  startPreset(e) {
    const type = e.currentTarget.dataset.type;
    const preset = presets.getDefaultPlan(type);
    wx.navigateTo({
      url: `/pages/timer/timer?preset=${type}`
    });
  },

  goToTimer() {
    wx.navigateTo({
      url: '/pages/timer/timer'
    });
  }
})
