module.exports.config = {
  name: "ping4",
  aliases: ["p4", "speed4", "pong4", "latency4"],
  version: "1.0.0",
  author: "Jan + ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} – Check how fast the bot responds!"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID } = event;
  const start = Date.now();

  const tempMsg = await api.sendMessage("📡 Pinging the bot...", threadID);

  const ping = Date.now() - start;
  let speedLabel, emoji;

  if (ping < 100) {
    speedLabel = "⚡ Ultra FAST";
    emoji = "🚀💨";
  } else if (ping < 250) {
    speedLabel = "✨ Medium Speed";
    emoji = "⚙️🛸";
  } else {
    speedLabel = "🐢 Slow Connection";
    emoji = "🐌📡";
  }

  const response = `
╭────── 𝗣𝗜𝗡𝗚 𝟰 🛰️ ──────╮

📶 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲 𝗧𝗶𝗺𝗲: ${ping} ms
🏷️ 𝗦𝗽𝗲𝗲𝗱 𝗦𝘁𝗮𝘁𝘂𝘀: ${speedLabel}
🔄 𝗧𝗲𝘀𝘁 𝗥𝗲𝗮𝗰𝘁𝗶𝗼𝗻: ${emoji}

╰───────────────╯

📡 𝗕𝗼𝘁 𝗶𝘀 𝗹𝗶𝘃𝗲 & 𝗿𝗲𝘀𝗽𝗼𝗻𝗱𝗶𝗻𝗴!
`.trim();

  api.editMessage(response, tempMsg.messageID, threadID);
};
