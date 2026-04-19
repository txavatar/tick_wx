let audioContext = null;
let vibrationEnabled = true;

function getAudioContext() {
  if (!audioContext) {
    audioContext = wx.createInnerAudioContext();
    audioContext.autoplay = false;
  }
  return audioContext;
}

function playBeep() {
  try {
    const audio = getAudioContext();
    audio.src = 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3';
    audio.play();
  } catch (e) {
    console.log('Audio play failed, using vibration');
    wx.vibrateShort({ type: 'light' });
  }
}

function playComplete() {
  try {
    const audio = getAudioContext();
    audio.src = 'https://assets.mixkit.co/active_storage/sfx/3004/3004-preview.mp3';
    audio.play();
  } catch (e) {
    console.log('Audio play failed, using vibration');
    wx.vibrateLong({ type: 'heavy' });
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
  if (audioContext) {
    audioContext.stop();
  }
}

module.exports = {
  playBeep,
  playComplete,
  vibrateLong,
  vibrateShort,
  setVibrationEnabled,
  stop
};
