let vibrationEnabled = true;
let tickAudio = null;
let voiceAudio = null;
let isPlaying = false;

function getTickAudio() {
  if (!tickAudio) {
    tickAudio = wx.createInnerAudioContext();
    tickAudio.volume = 1.0;
    tickAudio.obeyMuteSwitch = false;
  }
  return tickAudio;
}

function getVoiceAudio() {
  if (!voiceAudio) {
    voiceAudio = wx.createInnerAudioContext();
    voiceAudio.volume = 1.0;
    voiceAudio.obeyMuteSwitch = false;
  }
  return voiceAudio;
}

function playTick() {
  if (isPlaying) {
    if (tickAudio) {
      tickAudio.stop();
    }
  }
  isPlaying = true;

  const audio = getTickAudio();
  audio.src = 'assets/audio/tick.mp3';
  audio.play();
  audio.onEnded(() => {
    isPlaying = false;
  });
  audio.onError(() => {
    isPlaying = false;
  });

  if (vibrationEnabled) {
    wx.vibrateShort({ type: 'light' });
  }
}

function playCountdownVoice(num) {
  const voiceUrls = {
    3: 'assets/audio/3.mp3',
    2: 'assets/audio/2.mp3',
    1: 'assets/audio/1.mp3'
  };

  const url = voiceUrls[num];
  if (!url) return;

  const audio = getVoiceAudio();
  audio.stop();
  audio.src = url;
  audio.play();
  audio.onError(() => {
    console.log('Voice error');
  });

  if (vibrationEnabled) {
    if (num === 3) {
      wx.vibrateShort({ type: 'medium' });
    } else if (num === 2) {
      wx.vibrateShort({ type: 'medium' });
      setTimeout(() => wx.vibrateShort({ type: 'light' }), 100);
    } else if (num === 1) {
      wx.vibrateShort({ type: 'heavy' });
    }
  }
}

function playPhaseVoice(phase) {
  const voiceUrls = {
    'rest': 'assets/audio/rest.mp3',
    'work': 'assets/audio/go.mp3'
  };

  const url = voiceUrls[phase];
  if (!url) return;

  const audio = getVoiceAudio();
  audio.stop();
  audio.src = url;
  audio.play();
  audio.onError(() => {
    console.log('Phase voice error');
  });
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
  }
  if (voiceAudio) {
    voiceAudio.stop();
  }
  isPlaying = false;
}

module.exports = {
  playTick,
  playCountdownVoice,
  playPhaseVoice,
  playBeep,
  playComplete,
  vibrateLong,
  vibrateShort,
  setVibrationEnabled,
  stop
};
