const os = require("os");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "1.5.3",
    author: "XOS Ayan (Edited by Xalman)",
    role: 0,
    noPrefix: true,
    shortDescription: {
      en: "Check bot uptime without image."
    },
    longDescription: {
      en: "Displays bot uptime and system stats in text format only."
    },
    category: "system",
    guide: {
      en: "Just type 'uptime', 'upt', or 'up'"
    }
  },

  onStart: async function () {},

  onChat: async function ({ message, event, usersData, threadsData }) {
    const prefix = global.GoatBot.config.prefix;
    const body = (event.body || "").toLowerCase().trim();
    const triggers = [`uptime`, `upt`, `up`, `${prefix}uptime`, `${prefix}upt`, `${prefix}up`];
    if (!triggers.includes(body)) return;

    try {
      const uptimeSec = process.uptime();
      const days = Math.floor(uptimeSec / 86400);
      const hours = Math.floor((uptimeSec % 86400) / 3600);
      const minutes = Math.floor((uptimeSec % 3600) / 60);
      const seconds = Math.floor(uptimeSec % 60);

      const osType = os.type();
      const osRelease = os.release();
      const arch = os.arch();
      const cpu = os.cpus()[0].model;
      const totalMemMB = os.totalmem() / 1024 / 1024;
      const freeMemMB = os.freemem() / 1024 / 1024;
      const usedMemMB = totalMemMB - freeMemMB;
      const loadAvg = os.loadavg()[0].toFixed(2);
      const disk = await getDiskUsage();
      const totalUsers = (await usersData.getAll()).length;
      const totalThreads = (await threadsData.getAll()).length;
      const currentTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");

      await message.reply(
`𝐒𝐲𝐬𝐭𝐞𝐦 𝐒𝐭𝐚𝐭𝐮𝐬 🖥️
──────────────────────
⚙️ 𝐒𝐲𝐬𝐭𝐞𝐦 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧:
  • 𝐎𝐒: ${osType} ${osRelease}
  • 𝐀𝐫𝐜𝐡: ${arch}
  • 𝐂𝐏𝐔: ${cpu}
  • 𝐋𝐨𝐚𝐝 𝐀𝐯𝐞𝐫𝐚𝐠𝐞: ${loadAvg}%
──────────────────────
💾 𝐌𝐞𝐦𝐨𝐫𝐲 𝐈𝐧𝐟𝐨:
  • 𝐔𝐬𝐞𝐝: ${usedMemMB.toFixed(2)} MB / ${totalMemMB.toFixed(2)} MB
──────────────────────
📀 𝐃𝐢𝐬𝐤 𝐒𝐩𝐚𝐜𝐞:
  • 𝐔𝐬𝐞𝐝: ${(disk.used / 1024 / 1024 / 1024).toFixed(2)} GB / ${(disk.total / 1024 / 1024 / 1024).toFixed(2)} GB
──────────────────────
🤖 𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞:
  • ${days}D ${hours}H ${minutes}M ${seconds}S
📊 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${totalUsers}
💬 𝐓𝐨𝐭𝐚𝐥 𝐓𝐡𝐫𝐞𝐚𝐝𝐬: ${totalThreads}
🕒 𝐂𝐮𝐫𝐫𝐞𝐧𝐭 𝐓𝐢𝐦𝐞: ${currentTime}
──────────────────────`
      );
    } catch (e) {
      console.error(e);
      message.reply("❌ Error occurred while generating uptime info.");
    }
  }
};

async function getDiskUsage() {
  const { stdout } = await exec("df -k /");
  const lines = stdout.split("\n");
  const diskLine = lines[1].split(/\s+/);
  const total = parseInt(diskLine[1]) * 1024;
  const used = parseInt(diskLine[2]) * 1024;
  return { total, used };
}
