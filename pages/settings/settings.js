const app = getApp();

Page({
  data: {
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      keepScreenOn: true,
      darkMode: 'system'
    },
    darkModeOptions: ['跟随系统', '浅色模式', '深色模式'],
    darkModeIndex: 0,
    darkModeText: '跟随系统'
  },

  onLoad() {
    this.loadSettings();
  },

  loadSettings() {
    const settings = app.globalData.settings;
    this.setData({ settings });

    const modeMap = { 'system': 0, 'light': 1, 'dark': 2 };
    const textMap = { 'system': '跟随系统', 'light': '浅色模式', 'dark': '深色模式' };
    this.setData({
      darkModeIndex: modeMap[settings.darkMode] || 0,
      darkModeText: textMap[settings.darkMode] || '跟随系统'
    });

    this.applyDarkMode(settings.darkMode);
  },

  toggleSound(e) {
    const soundEnabled = e.detail.value;
    this.updateSetting('soundEnabled', soundEnabled);
  },

  toggleVibration(e) {
    const vibrationEnabled = e.detail.value;
    this.updateSetting('vibrationEnabled', vibrationEnabled);
  },

  toggleKeepScreen(e) {
    const keepScreenOn = e.detail.value;
    this.updateSetting('keepScreenOn', keepScreenOn);
  },

  changeDarkMode(e) {
    const modes = ['system', 'light', 'dark'];
    const darkMode = modes[e.detail.value];
    this.updateSetting('darkMode', darkMode);
    this.setData({
      darkModeIndex: e.detail.value,
      darkModeText: this.data.darkModeOptions[e.detail.value]
    });
    this.applyDarkMode(darkMode);
  },

  updateSetting(key, value) {
    const settings = { ...this.data.settings, [key]: value };
    this.setData({ settings });
    app.saveSettings(settings);
  },

  applyDarkMode(mode) {
    if (mode === 'dark') {
      wx.setBackgroundColor({ backgroundColor: '#1A1A2E' });
    } else if (mode === 'light') {
      wx.setBackgroundColor({ backgroundColor: '#FFFFFF' });
    } else {
      wx.setBackgroundColor({ backgroundColor: '#F5F5F5' });
    }
  },

  clearAllData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          app.globalData.settings = {
            soundEnabled: true,
            vibrationEnabled: true,
            keepScreenOn: true,
            darkMode: 'system'
          };
          app.globalData.lastPlanId = null;
          this.loadSettings();
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  }
})
