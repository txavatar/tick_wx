const app = getApp();
const storage = require('../../utils/storage.js');
const presets = require('../../constants/presets.js');

Page({
  data: {
    lastPlan: null,
    isDarkMode: false
  },

  onLoad() {
    this.loadSettings();
    this.loadLastPlan();
  },

  onShow() {
    this.loadSettings();
    this.loadLastPlan();
  },

  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({
      isDarkMode: settings.darkMode === 'dark'
    });
  },

  loadLastPlan() {
    const lastPlanId = app.globalData.lastPlanId;
    if (lastPlanId) {
      const plan = storage.getPlan(lastPlanId);
      if (plan) {
        const description = this.getPlanDescription(plan);
        this.setData({ lastPlan: { ...plan, description } });
      }
    }
  },

  getPlanDescription(plan) {
    const config = plan.config;
    if (config.sets && config.workDuration) {
      return `${config.workDuration}秒训练 / ${config.restDuration || 0}秒休息 × ${config.sets}组`;
    }
    if (config.beats) {
      return `${config.beats.length}个节奏点 / ${config.loopCount || 1}循环`;
    }
    return '';
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
