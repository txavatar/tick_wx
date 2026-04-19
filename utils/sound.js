let vibrationEnabled = true;

function playTick() {
  // 播放音频
  const audio = wx.createInnerAudioContext();
  audio.src = '/assets/audio/tick.mp3';
  audio.volume = 1.0;
  audio.play();
  audio.onError(() => {
    console.log('Tick audio play failed');
  });
  audio.onPlay(() => {
    console.log('Tick audio playing');
  });
  // 播放完后销毁
  setTimeout(() => {
    audio.destroy();
  }, 500);

  // 同时震动
  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'light' });
  }
}

function playCountdownVoice(num) {
  if (!vibrationEnabled) return;

  // 3-2-1 越来越强的震动模式
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
