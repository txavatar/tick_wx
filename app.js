App({
  globalData: {
    settings: {
      soundEnabled: true,
      vibrationEnabled: true,
      keepScreenOn: true,
      darkMode: 'system'
    },
    lastPlanId: null
  },

  onLaunch() {
    this.loadSettings();
    this.applyDarkMode();
  },

  onShow() {
    this.loadSettings();
    this.applyDarkMode();
  },

  loadSettings() {
    const settings = wx.getStorageSync('settings');
    if (settings) {
      this.globalData.settings = { ...this.globalData.settings, ...settings };
    }
  },

  saveSettings(settings) {
    this.globalData.settings = { ...this.globalData.settings, ...settings };
    wx.setStorageSync('settings', this.globalData.settings);
    this.applyDarkMode();
  },

  applyDarkMode() {
    const mode = this.globalData.settings.darkMode;
    if (mode === 'dark') {
      wx.setBackgroundColor({ backgroundColor: '#1A1A2E' });
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1A1A2E'
      });
    } else if (mode === 'light') {
      wx.setBackgroundColor({ backgroundColor: '#FFFFFF' });
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#FFFFFF'
      });
    } else {
      wx.setBackgroundColor({ backgroundColor: '#F5F5F5' });
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#F5F5F5'
      });
    }
  }
})
