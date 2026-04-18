const PRESETS = {
  fitness: [
    {
      name: 'Tabata',
      config: {
        sets: 8,
        workDuration: 20,
        restDuration: 10,
        prepDuration: 10
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: true
      }
    },
    {
      name: '30-30训练',
      config: {
        sets: 10,
        workDuration: 30,
        restDuration: 30,
        prepDuration: 10
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: true
      }
    },
    {
      name: 'HIIT经典',
      config: {
        sets: 8,
        workDuration: 40,
        restDuration: 20,
        prepDuration: 10
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: true
      }
    }
  ],
  meditation: [
    {
      name: '4-4-4呼吸法',
      config: {
        workDuration: 12,
        prepDuration: 5,
        loopCount: 6
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: true
      }
    },
    {
      name: '4-7-8呼吸',
      config: {
        workDuration: 19,
        prepDuration: 5,
        loopCount: 4
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: true
      }
    }
  ],
  beat: [
    {
      name: '60BPM',
      config: {
        beats: [{ duration: 1 }, { duration: 1 }],
        loopCount: 60,
        prepDuration: 3
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: false
      }
    },
    {
      name: '90BPM',
      config: {
        beats: [{ duration: 1 }, { duration: 1 }],
        loopCount: 90,
        prepDuration: 3
      },
      soundConfig: {
        soundEnabled: true,
        vibrationEnabled: false
      }
    }
  ]
};

function getDefaultPlan(type) {
  const preset = PRESETS[type];
  if (!preset || preset.length === 0) return null;
  return { ...preset[0] };
}

function getAllPresets(type) {
  return PRESETS[type] || [];
}

module.exports = {
  getDefaultPlan,
  getAllPresets,
  PRESETS
};
