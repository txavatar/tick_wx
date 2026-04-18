const storage = require('../../utils/storage.js');

Page({
  data: {
    filterType: 'all',
    plans: []
  },

  onLoad() {
    this.loadPlans();
  },

  onShow() {
    this.loadPlans();
  },

  loadPlans() {
    const allPlans = storage.getAllPlans();
    const filterType = this.data.filterType;
    const filteredPlans = filterType === 'all'
      ? allPlans
      : allPlans.filter(p => p.type === filterType);

    const plans = filteredPlans.map(plan => ({
      ...plan,
      typeIcon: this.getTypeIcon(plan.type),
      description: this.getPlanDescription(plan)
    }));
    this.setData({ plans });
  },

  getTypeIcon(type) {
    const icons = { fitness: '🏋️', meditation: '🧘', beat: '🎵' };
    return icons[type] || '⏱️';
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

  filterPlans(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.loadPlans();
  },

  startPlan(e) {
    const planId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/timer/timer?planId=${planId}`
    });
  },

  editPlan(e) {
    const planId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/plan-edit/plan-edit?planId=${planId}`
    });
  },

  deletePlan(e) {
    const planId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个计划吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deletePlan(planId);
          this.loadPlans();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  createPlan() {
    wx.navigateTo({
      url: '/pages/plan-edit/plan-edit'
    });
  }
})
