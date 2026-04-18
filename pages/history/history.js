const app = getApp();
const storage = require('../../utils/storage.js');

Page({
  data: {
    weekCount: 0,
    monthCount: 0,
    groupedHistory: [],
    isDarkMode: false
  },

  onShow() {
    const settings = app.globalData.settings;
    this.setData({ isDarkMode: settings.darkMode === 'dark' });
    this.loadHistory();
  },

  loadHistory() {
    const history = storage.getAllHistory();
    const now = new Date();
    const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    let weekCount = 0;
    let monthCount = 0;

    history.forEach(record => {
      if (record.completedAt >= weekAgo) weekCount++;
      if (record.completedAt >= monthAgo) monthCount++;
    });

    const grouped = this.groupByDate(history);
    this.setData({
      weekCount,
      monthCount,
      groupedHistory: grouped
    });
  },

  groupByDate(history) {
    const groups = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    history.forEach(record => {
      const date = new Date(record.completedAt).toDateString();
      let dateLabel = date;
      if (date === today) dateLabel = '今天';
      else if (date === yesterday) dateLabel = '昨天';

      const time = new Date(record.completedAt);
      const timeStr = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;

      if (!groups[dateLabel]) {
        groups[dateLabel] = { date: dateLabel, records: [] };
      }

      const minutes = Math.floor(record.totalDuration / 60);
      const seconds = record.totalDuration % 60;
      const durationText = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;

      groups[dateLabel].records.push({
        ...record,
        completedTime: timeStr,
        totalDurationText: durationText,
        statusText: record.status === 'completed' ? '已完成' : '已停止',
        status: record.status
      });
    });

    return Object.values(groups);
  }
})
