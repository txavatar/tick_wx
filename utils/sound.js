let vibrationEnabled = true;
let tickAudio = null;
let voiceAudio = null;

function getTickAudio() {
  if (!tickAudio) {
    tickAudio = wx.createInnerAudioContext();
    tickAudio.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3';
    tickAudio.volume = 0.3;
  }
  return tickAudio;
}

function getVoiceAudio() {
  if (!voiceAudio) {
    voiceAudio = wx.createInnerAudioContext();
    voiceAudio.volume = 1.0;
  }
  return voiceAudio;
}

function playTick() {
  if (!vibrationEnabled) return;

  try {
    const audio = getTickAudio();
    audio.currentTime = 0;
    audio.play();
    audio.onError(() => {
      wx.vibrateShort({ type: 'light' });
    });
  } catch (e) {
    wx.vibrateShort({ type: 'light' });
  }
}

function playCountdownVoice(num) {
  if (!vibrationEnabled) return;

  const voiceUrls = {
    3: 'https://www.colinc.us/audio/3.mp3',
    2: 'https://www.colinc.us/audio/2.mp3',
    1: 'https://www.colinc.us/audio/1.mp3'
  };

  const url = voiceUrls[num];
  if (!url) return;

  try {
    const audio = getVoiceAudio();
    audio.src = url;
    audio.play();
    audio.onError(() => {
      wx.vibrateLong({ type: 'heavy' });
    });
  } catch (e) {
    wx.vibrateLong({ type: 'heavy' });
  }
}

function playBeep() {
  playTick();
}

function playComplete() {
  if (!vibrationEnabled) return;

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
    wx.vibrateShort({ type: 'heavy' });
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
