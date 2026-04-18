const app = getApp();
const storage = require('../../utils/storage.js');

Page({
  data: {
    isEdit: false,
    planId: null,
    planName: '',
    planType: 'fitness',
    sets: 8,
    workDuration: 20,
    restDuration: 10,
    prepDuration: 10,
    loopCount: 6,
    beats: [{ duration: 1 }],
    soundEnabled: true,
    vibrationEnabled: true,
    isDarkMode: false
  },

  onLoad(options) {
    const settings = app.globalData.settings;
    this.setData({ isDarkMode: settings.darkMode === 'dark' });

    if (options.planId) {
      this.loadPlan(options.planId);
    }
  },

  loadPlan(planId) {
    const plan = storage.getPlan(planId);
    if (plan) {
      this.setData({
        isEdit: true,
        planId: plan.id,
        planName: plan.name,
        planType: plan.type,
        sets: plan.config.sets || 8,
        workDuration: plan.config.workDuration || 20,
        restDuration: plan.config.restDuration || 10,
        prepDuration: plan.config.prepDuration || 10,
        loopCount: plan.config.loopCount || 6,
        beats: plan.config.beats || [{ duration: 1 }],
        soundEnabled: plan.soundConfig.soundEnabled,
        vibrationEnabled: plan.soundConfig.vibrationEnabled
      });
    }
  },

  onNameInput(e) {
    this.setData({ planName: e.detail.value });
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ planType: type });
  },

  decrease(e) {
    const key = e.currentTarget.dataset.key;
    const value = this.data[key];
    if (value > 1) {
      this.setData({ [key]: value - 1 });
    }
  },

  increase(e) {
    const key = e.currentTarget.dataset.key;
    const value = this.data[key];
    if (value < 999) {
      this.setData({ [key]: value + 1 });
    }
  },

  decreaseBeat(e) {
    const index = e.currentTarget.dataset.index;
    const beats = [...this.data.beats];
    if (beats[index].duration > 1) {
      beats[index].duration -= 1;
      this.setData({ beats });
    }
  },

  increaseBeat(e) {
    const index = e.currentTarget.dataset.index;
    const beats = [...this.data.beats];
    beats[index].duration += 1;
    this.setData({ beats });
  },

  addBeat() {
    const beats = [...this.data.beats, { duration: 1 }];
    this.setData({ beats });
  },

  removeBeat() {
    if (this.data.beats.length > 1) {
      const beats = this.data.beats.slice(0, -1);
      this.setData({ beats });
    }
  },

  toggleSound(e) {
    this.setData({ soundEnabled: e.detail.value });
  },

  toggleVibration(e) {
    this.setData({ vibrationEnabled: e.detail.value });
  },

  savePlan() {
    if (!this.data.planName.trim()) {
      wx.showToast({ title: '请输入计划名称', icon: 'none' });
      return;
    }

    const plan = {
      id: this.data.planId || 'plan_' + Date.now(),
      name: this.data.planName.trim(),
      type: this.data.planType,
      config: {},
      soundConfig: {
        soundEnabled: this.data.soundEnabled,
        vibrationEnabled: this.data.vibrationEnabled
      },
      createdAt: this.data.isEdit ? undefined : Date.now(),
      updatedAt: Date.now()
    };

    if (this.data.planType === 'beat') {
      plan.config = {
        beats: this.data.beats,
        loopCount: this.data.loopCount
      };
    } else {
      plan.config = {
        sets: this.data.sets,
        workDuration: this.data.workDuration,
        restDuration: this.data.planType === 'fitness' ? this.data.restDuration : 0,
        prepDuration: this.data.prepDuration,
        loopCount: this.data.planType === 'meditation' ? this.data.loopCount : 0
      };
    }

    storage.savePlan(plan);
    wx.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
})
