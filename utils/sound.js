let vibrationEnabled = true;

function playTick() {
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'light' });
  }
}

function playCountdownVoice(num) {
  if (!vibrationEnabled) return;

  // 3-2-1 越来越强的震动模式
  if (num === 3) {
    wx.vibrateShort({ type: 'medium' });
  } else if (num === 2) {
    wx.vibrateShort({ type: 'heavy' });
    setTimeout(() => wx.vibrateShort({ type: 'medium' }), 100);
  } else if (num === 1) {
    wx.vibrateShort({ type: 'heavy' });
    setTimeout(() => wx.vibrateShort({ type: 'heavy' }), 100);
    setTimeout(() => wx.vibrateShort({ type: 'medium' }), 200);
  }
}

function playBeep() {
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'medium' });
  }
}

function playComplete() {
  if (vibrationEnabled) {
    wx.vibrateLong({ type: 'heavy' });
    setTimeout(() => wx.vibrateShort({ type: 'heavy' }), 200);
    setTimeout(() => wx.vibrateShort({ type: 'heavy' }), 400);
    setTimeout(() => wx.vibrateShort({ type: 'heavy' }), 600);
  }
}

function vibrateLong() {
  if (vibrationEnabled) {
    wx.vibrateLong({ type: 'heavy' });
  }
}

function vibrateShort() {
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'medium' });
  }
}

function setVibrationEnabled(enabled) {
  vibrationEnabled = enabled;
}

function stop() {
  // No-op
}

module.exports = {
  playTick,
  playCountdownVoice,
  playBeep,
  playComplete,
  vibrateLong,
  vibrateShort,
  setVibrationEnabled,
  stop
};
