let vibrationEnabled = true;

function playBeep() {
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'medium' });
  }
}

function playComplete() {
  if (vibrationEnabled) {
    wx.vibrateLong({ type: 'heavy' });
    setTimeout(() => {
      wx.vibrateShort({ type: 'medium' });
    }, 200);
    setTimeout(() => {
      wx.vibrateShort({ type: 'medium' });
    }, 400);
  }
}

function vibrateLong() {
  if (vibrationEnabled) {
    wx.vibrateLong({ type: 'heavy' });
  }
}

function vibrateShort() {
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'heavy' });
  }
}

function setVibrationEnabled(enabled) {
  vibrationEnabled = enabled;
}

function stop() {
  // No-op
}

module.exports = {
  playBeep,
  playComplete,
  vibrateLong,
  vibrateShort,
  setVibrationEnabled,
  stop
};
