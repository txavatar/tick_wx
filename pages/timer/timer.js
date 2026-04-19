const app = getApp();
const storage = require('../../utils/storage.js');
const timer = require('../../utils/timer.js');
const sound = require('../../utils/sound.js');

Page({
  data: {
    planId: null,
    planType: 'fitness',
    displayTime: '0',
    phaseText: '准备开始',
    phaseClass: '',
    currentSet: 0,
    totalSets: 8,
    progress: 0,
    etaTime: '--:--',
    isRunning: false,
    isPaused: false,
    phase: 'idle',
    config: {
      sets: 8,
      workDuration: 20,
      restDuration: 10,
      prepDuration: 0,
      loopCount: 6
    },
    soundEnabled: true,
    vibrationEnabled: true
  },

  timerInstance: null,
  startTime: null,
  totalDuration: 0,
  lastTapTime: 0,

  onLoad(options) {
    this.initTimer();

    if (options.planId) {
      this.loadPlan(options.planId);
    } else if (options.preset) {
      this.loadPreset(options.preset);
    } else {
      this.loadDefaultConfig();
    }
  },

  onShow() {
    const settings = app.globalData.settings;
    this.setData({
      soundEnabled: settings.soundEnabled,
      vibrationEnabled: settings.vibrationEnabled
    });

    if (settings.keepScreenOn) {
      wx.setKeepScreenOn({ keepScreenOn: true });
    }
  },

  onHide() {
    wx.setKeepScreenOn({ keepScreenOn: false });
  },

  onUnload() {
    wx.setKeepScreenOn({ keepScreenOn: false });
    if (this.timerInstance) {
      this.timerInstance.stop();
    }
  },

  initTimer() {
    this.timerInstance = timer.createTimer();
    this.timerInstance.onTick = this.onTick.bind(this);
    this.timerInstance.onPhaseChange = this.onPhaseChange.bind(this);
    this.timerInstance.onComplete = this.onComplete.bind(this);
  },

  loadPlan(planId) {
    const plan = storage.getPlan(planId);
    if (plan) {
      app.globalData.lastPlanId = planId;
      this.setData({
        planId: plan.id,
        planType: plan.type,
        config: plan.config,
        soundEnabled: plan.soundConfig.soundEnabled,
        vibrationEnabled: plan.soundConfig.vibrationEnabled,
        totalSets: plan.config.sets || plan.config.loopCount || 1
      });
      this.timerInstance.setConfig({
        type: plan.type,
        ...plan.config
      });
      this.updateETA();
    }
  },

  loadPreset(preset) {
    const presets = require('../../constants/presets.js');
    const presetData = presets.getDefaultPlan(preset);
    if (presetData) {
      this.setData({
        planType: preset,
        config: presetData.config,
        soundEnabled: presetData.soundConfig.soundEnabled,
        vibrationEnabled: presetData.soundConfig.vibrationEnabled,
        totalSets: presetData.config.sets || presetData.config.loopCount || 1
      });
      this.timerInstance.setConfig({
        type: preset,
        ...presetData.config
      });
      this.updateETA();
    }
  },

  loadDefaultConfig() {
    const defaultConfig = {
      sets: 8,
      workDuration: 20,
      restDuration: 10,
      prepDuration: 0,
      loopCount: 6
    };
    this.setData({
      config: defaultConfig,
      totalSets: 8
    });
    this.timerInstance.setConfig({
      type: 'fitness',
      ...defaultConfig
    });
    this.updateETA();
  },

  onTap() {
    const now = Date.now();
    if (now - this.lastTapTime < 300) {
      this.toggleTimer();
    }
    this.lastTapTime = now;
  },

  toggleTimer() {
    if (this.data.phase === 'idle') {
      this.startTimer();
    } else if (this.data.isRunning) {
      this.pauseTimer();
    } else {
      this.resumeTimer();
    }
  },

  startTimer() {
    this.startTime = Date.now();
    this.timerInstance.start();
    this.setData({
      isRunning: true,
      isPaused: false,
      phase: 'preparing'
    });
    this.updatePhaseDisplay('preparing');
    this.onPhaseStart();
  },

  pauseTimer() {
    this.timerInstance.pause();
    this.setData({ isRunning: false, isPaused: true });
    if (this.data.soundEnabled) {
      sound.vibrateShort();
    }
  },

  resumeTimer() {
    this.timerInstance.resume();
    this.setData({ isRunning: true, isPaused: false });
    if (this.data.soundEnabled) {
      sound.vibrateShort();
    }
  },

  stopTimer() {
    wx.showModal({
      title: '确认结束',
      content: '确定要结束当前训练吗？',
      success: (res) => {
        if (res.confirm) {
          this.finishTimer('stopped');
        }
      }
    });
  },

  onPhaseStart() {
    if (this.data.soundEnabled) {
      sound.playBeep();
    }
  },

  onTick(remaining, phase, currentSet, totalSets) {
    this.setData({
      displayTime: remaining,
      currentSet,
      totalSets,
      progress: this.calculateProgress(currentSet, totalSets, remaining)
    });

    if (!this.data.soundEnabled) return;

    // 节拍模式(beat)每秒都是tick，不做3-2-1 countdown
    if (phase === 'beat') {
      sound.playTick();
    } else if (remaining <= 3 && remaining > 0) {
      sound.playCountdownVoice(remaining);
    } else if (remaining > 0) {
      sound.playTick();
    }
  },

  onPhaseChange(prevPhase, newPhase) {
    if (this.data.soundEnabled) {
      sound.playBeep();
    }
    this.updatePhaseDisplay(newPhase);
  },

  onComplete() {
    if (this.data.soundEnabled) {
      sound.playComplete();
    }
    this.finishTimer('completed');
  },

  updatePhaseDisplay(phase) {
    const phaseTexts = {
      'idle': { text: '准备开始', class: '' },
      'preparing': { text: '准备中', class: 'prep' },
      'work': { text: '训练中', class: 'work' },
      'rest': { text: '休息中', class: 'rest' },
      'beat': { text: '节拍', class: 'work' },
      'completed': { text: '完成', class: 'completed' }
    };

    const info = phaseTexts[phase] || phaseTexts.idle;
    this.setData({
      phase,
      phaseText: info.text,
      phaseClass: info.class
    });
  },

  calculateProgress(currentSet, totalSets, remaining) {
    if (totalSets === 0) return 0;
    const config = this.data.config;
    const setDuration = (config.workDuration || 0) + (config.restDuration || 0);

    if (config.type === 'beat') {
      const beatDuration = config.beats ? config.beats.reduce((sum, b) => sum + b.duration, 0) : 1;
      const totalTime = beatDuration * config.loopCount;
      const elapsed = (currentSet - 1) * beatDuration + ((config.beats?.length || 1) - remaining);
      return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
    }

    const totalTime = setDuration * totalSets + (config.prepDuration || 0);
    const elapsed = (currentSet - 1) * setDuration + ((config.workDuration || 0) - remaining);
    return Math.min(100, Math.max(0, (elapsed / totalTime) * 100));
  },

  updateETA() {
    const totalDuration = this.getTotalDuration();
    const now = new Date();
    const eta = new Date(now.getTime() + totalDuration * 1000);
    const etaStr = `${eta.getHours().toString().padStart(2, '0')}:${eta.getMinutes().toString().padStart(2, '0')}`;
    this.setData({ etaTime: etaStr });
  },

  getTotalDuration() {
    const config = this.data.config;
    if (config.beats) {
      const beatDuration = config.beats.reduce((sum, b) => sum + b.duration, 0);
      return beatDuration * config.loopCount;
    }
    const setDuration = (config.workDuration || 0) + (config.restDuration || 0);
    return (config.prepDuration || 0) + setDuration * config.sets;
  },

  finishTimer(status) {
    this.timerInstance.stop();
    this.totalDuration = Math.floor((Date.now() - this.startTime) / 1000);

    const plan = this.data.planId ? storage.getPlan(this.data.planId) : null;
    const planName = plan ? plan.name : (this.data.planId ? '自定义训练' : '快速训练');

    const record = {
      id: 'history_' + Date.now(),
      planId: this.data.planId || 'preset',
      planName,
      startedAt: this.startTime,
      completedAt: Date.now(),
      totalDuration: this.totalDuration,
      completedSets: this.data.currentSet,
      plannedSets: this.data.totalSets,
      status
    };

    storage.saveHistory(record);

    const minutes = Math.floor(this.totalDuration / 60);
    const seconds = this.totalDuration % 60;
    const durationText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

    wx.showModal({
      title: status === 'completed' ? '训练完成' : '训练已停止',
      content: `训练时长: ${durationText}`,
      showCancel: false,
      success: () => {
        wx.navigateBack();
      }
    });
  }
})
