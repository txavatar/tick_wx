function createTimer() {
  let intervalId = null;
  let remaining = 0;
  let currentSet = 1;
  let phase = 'idle';
  let config = {};
  let isPaused = false;
  let phaseSequence = [];
  let phaseIndex = 0;

  let onTickCallback = null;
  let onPhaseChangeCallback = null;
  let onCompleteCallback = null;

  function buildPhaseSequence() {
    const sequences = [];

    if (config.type === 'fitness') {
      if (config.prepDuration > 0) {
        sequences.push({ phase: 'preparing', duration: config.prepDuration });
      }
      for (let i = 0; i < config.sets; i++) {
        sequences.push({ phase: 'work', duration: config.workDuration });
        if (i < config.sets - 1 && config.restDuration > 0) {
          sequences.push({ phase: 'rest', duration: config.restDuration });
        }
      }
    } else if (config.type === 'meditation') {
      if (config.prepDuration > 0) {
        sequences.push({ phase: 'preparing', duration: config.prepDuration });
      }
      for (let i = 0; i < config.loopCount; i++) {
        sequences.push({ phase: 'work', duration: config.workDuration });
      }
    } else if (config.type === 'beat') {
      if (config.prepDuration > 0) {
        sequences.push({ phase: 'preparing', duration: config.prepDuration });
      }
      for (let i = 0; i < config.loopCount; i++) {
        config.beats.forEach(beat => {
          sequences.push({ phase: 'beat', duration: beat.duration });
        });
      }
    }

    return sequences;
  }

  function runPhase() {
    if (phaseIndex >= phaseSequence.length) {
      if (onCompleteCallback) onCompleteCallback();
      return;
    }

    const currentPhase = phaseSequence[phaseIndex];
    phase = currentPhase.phase;
    remaining = currentPhase.duration;

    const prevPhase = phaseIndex > 0 ? phaseSequence[phaseIndex - 1].phase : null;
    if (onPhaseChangeCallback) {
      onPhaseChangeCallback(prevPhase, phase);
    }

    if (onTickCallback) {
      onTickCallback(remaining, phase, currentSet, config.sets || config.loopCount || 1);
    }

    intervalId = setInterval(() => {
      if (isPaused) return;

      remaining--;

      if (remaining <= 0) {
        clearInterval(intervalId);
        phaseIndex++;
        currentSet = calculateCurrentSet();
        runPhase();
      } else {
        currentSet = calculateCurrentSet();
        if (onTickCallback) {
          onTickCallback(remaining, phase, currentSet, config.sets || config.loopCount || 1);
        }
      }
    }, 1000);
  }

  function calculateCurrentSet() {
    let set = 1;
    for (let i = 0; i < phaseIndex; i++) {
      if (phaseSequence[i].phase === 'work' || phaseSequence[i].phase === 'beat') {
        set++;
      }
    }
    return set;
  }

  return {
    setConfig(cfg) {
      config = cfg;
      phaseSequence = buildPhaseSequence();
    },

    start() {
      if (phaseSequence.length === 0) {
        phaseSequence = buildPhaseSequence();
      }
      phaseIndex = 0;
      currentSet = 1;
      isPaused = false;
      runPhase();
    },

    pause() {
      isPaused = true;
    },

    resume() {
      isPaused = false;
    },

    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      phase = 'idle';
      remaining = 0;
      isPaused = false;
      phaseIndex = 0;
    },

    get onTick() {
      return onTickCallback;
    },
    set onTick(fn) {
      onTickCallback = fn;
    },

    get onPhaseChange() {
      return onPhaseChangeCallback;
    },
    set onPhaseChange(fn) {
      onPhaseChangeCallback = fn;
    },

    get onComplete() {
      return onCompleteCallback;
    },
    set onComplete(fn) {
      onCompleteCallback = fn;
    }
  };
}

module.exports = { createTimer };
