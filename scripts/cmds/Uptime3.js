const os = require('os');
const moment = require('moment');

module.exports = {
  config: {
    name: "uptime3",
    version: "5.0",
    author: "Dbz_Mahin",
    role: 0,
    countDown: 5,
    shortDescription: "Show bot uptime & system stats",
    longDescription: "Displays detailed bot uptime and system information",
    category: "utility",
    guide: {
      en: "{prefix}uptime3"
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Uptime calculation
      const uptimeSeconds = process.uptime();
      const formattedUptime = moment.duration(uptimeSeconds, 'seconds').humanize();
      
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeSeconds % 60);

      // System information
      const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
      const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
      const usedMem = (totalMem - freeMem).toFixed(2);
      const cpu = os.cpus()[0].model;
      const platform = os.platform();
      const arch = os.arch();

      // Bot information
      const startTime = new Date(Date.now() - uptimeSeconds * 1000);
      const formattedStartTime = moment(startTime).format('YYYY-MM-DD HH:mm:ss');
      const ping = Date.now() - event.timestamp;

      // Create message
      const message = `
╭───「 BOT UPTIME 」───
│
├⏰ Uptime: ${formattedUptime}
│  (${days}d ${hours}h ${minutes}m ${seconds}s)
│
├📅 Started: ${formattedStartTime}
├📶 Ping: ${ping}ms
│
├💻 System Info:
│ ├─ OS: ${platform} (${arch})
│ ├─ CPU: ${cpu}
│ ├─ RAM: ${usedMem}GB / ${totalMem}GB
│
╰───「 Owner👑: Dbz_Mahin 」───
      `;

      api.sendMessage(message, event.threadID);
    } catch (error) {
      console.error('[UPTIME ERROR]', error);
      api.sendMessage("❌ An error occurred while checking uptime.", event.threadID);
    }
  }
};
