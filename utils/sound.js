let vibrationEnabled = true;
let tickAudio = null;
let isPlaying = false;

function getTickAudio() {
  if (!tickAudio) {
    tickAudio = wx.createInnerAudioContext();
    tickAudio.src = '/assets/audio/tick.mp3';
    tickAudio.volume = 1.0;
    tickAudio.obeyMuteSwitch = false;
  }
  return tickAudio;
}

function playTick() {
  if (isPlaying) return;
  isPlaying = true;

  const audio = getTickAudio();
  audio.stop();
  audio.currentTime = 0;

  audio.play();
  audio.onPlay(() => {
    console.log('Tick playing');
  });
  audio.onEnded(() => {
    console.log('Tick ended');
    isPlaying = false;
  });
  audio.onError((err) => {
    console.log('Tick error:', err);
    isPlaying = false;
  });

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
  if (tickAudio) {
    tickAudio.stop();
    isPlaying = false;
  }
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
