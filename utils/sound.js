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
    audio.src = '/assets/sounds/beep.mp3';
    audio.play();
  } catch (e) {
    console.log('Audio play failed:', e);
  }
}

function playCountdown() {
  playBeep();
}

function playComplete() {
  try {
    const audio = getAudioContext();
    audio.src = '/assets/sounds/complete.mp3';
    audio.play();
  } catch (e) {
    console.log('Audio play failed:', e);
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
  playCountdown,
  playComplete,
  vibrateLong,
  vibrateShort,
  setVibrationEnabled,
  stop
};
