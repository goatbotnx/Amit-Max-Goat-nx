module.exports.config = {
  name: "uptime7",
  aliases: ["up7", "status7", "upt7"],
  version: "1.0.0",
  author: "Mahin+ ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} - Show bot status including uptime and ping"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const start = Date.now();

  // Uptime
  const uptimeMs = process.uptime() * 1000;
  const uptimeSec = Math.floor((uptimeMs / 1000) % 60);
  const uptimeMin = Math.floor((uptimeMs / (1000 * 60)) % 60);
  const uptimeHrs = Math.floor((uptimeMs / (1000 * 60 * 60)) % 24);
  const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));

  const uptimeStr = `${uptimeDays}d ${uptimeHrs}h ${uptimeMin}m ${uptimeSec}s`;

  // Send a temporary message to measure ping
  const pingMsg = await api.sendMessage("⏳ Checking bot status...", threadID);

  const end = Date.now();
  const ping = end - start;

  // Edit the original message with fancy status
  const status = `
╭───────────────────────╮
         𝗕𝗢𝗧 𝗦𝗧𝗔𝗧𝗨𝗦 📊
──────╯
╰─────────────────

┏━━━━━━━━━━━━━━━┓
┃ 💤 𝖴𝗉𝗍𝗂𝗆𝖾: ⏳ ${uptimeStr}
┃ ⚡ 𝖯𝗂𝗇𝗀: ${ping}ms
┃ 👑 𝖮𝗐𝗇𝖾𝗋: Mahin
┗━━━━━━━━━━━━━━━┛

𝗕𝗼𝘁 𝗶𝘀 𝗮𝗹𝗶𝘃𝗲 𝗮𝗻𝗱 𝗿𝗲𝗮𝗱𝘆 𝘁𝗼 𝗿𝘂𝗹𝗲! 🚀
`.trim();

  api.editMessage(status, pingMsg.messageID, threadID);
};
