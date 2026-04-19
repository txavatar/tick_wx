let vibrationEnabled = true;
let tickAudioManager = null;
let voiceAudioManager = null;

function getTickAudioManager() {
  if (!tickAudioManager) {
    tickAudioManager = wx.createInnerAudioContext();
    tickAudioManager.src = '/assets/audio/tick.mp3';
    tickAudioManager.volume = 0.5;
  }
  return tickAudioManager;
}

function getVoiceAudioManager() {
  if (!voiceAudioManager) {
    voiceAudioManager = wx.createInnerAudioContext();
    voiceAudioManager.volume = 1.0;
  }
  return voiceAudioManager;
}

function playTick() {
  if (!vibrationEnabled) return;

  try {
    const audio = getTickAudioManager();
    audio.currentTime = 0;
    audio.play();
  } catch (e) {
    console.log('Tick audio play failed:', e);
  }

  wx.vibrateShort({ type: 'light' });
}

function playCountdownVoice(num) {
  if (!vibrationEnabled) return;

  const voiceUrls = {
    3: '/assets/audio/3.mp3',
    2: '/assets/audio/2.mp3',
    1: '/assets/audio/1.mp3'
  };

  const url = voiceUrls[num];
  if (!url) return;

  try {
    const audio = getVoiceAudioManager();
    audio.src = url;
    audio.play();
  } catch (e) {
    console.log('Voice audio play failed:', e);
  }

  if (num === 3) {
    wx.vibrateShort({ type: 'medium' });
  } else if (num === 2) {
    wx.vibrateShort({ type: 'heavy' });
  } else if (num === 1) {
    wx.vibrateLong({ type: 'heavy' });
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
  if (tickAudioManager) {
    tickAudioManager.stop();
  }
  if (voiceAudioManager) {
    voiceAudioManager.stop();
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
