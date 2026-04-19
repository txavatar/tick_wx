let vibrationEnabled = true;

function playTick() {
  const audio = wx.createInnerAudioContext();
  audio.src = '/assets/audio/tick.mp3';
  audio.volume = 1.0;
  audio.play();

  // 监听播放完成再销毁
  audio.onEnded(() => {
    console.log('Tick audio ended');
    audio.destroy();
  });

  // 监听错误
  audio.onError((err) => {
    console.log('Tick audio error:', err);
    audio.destroy();
  });

  // 震动反馈
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'light' });
  }
}

function playCountdownVoice(num) {
  if (!vibrationEnabled) return;

  if (num === 3) {
    wx.vibrateShort({ type: 'medium' });
    setTimeout(() => wx.vibrateShort({ type: 'light' }), 80);
  } else if (num === 2) {
    wx.vibrateShort({ type: 'medium' });
    setTimeout(() => wx.vibrateShort({ type: 'medium' }), 80);
  } else if (num === 1) {
    wx.vibrateShort({ type: 'heavy' });
    setTimeout(() => wx.vibrateShort({ type: 'medium' }), 80);
    setTimeout(() => wx.vibrateShort({ type: 'light' }), 160);
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
