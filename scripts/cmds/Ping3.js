module.exports.config = {
  name: "ping3",
  aliases: ["p3", "pong3", "speed3", "lat3"],
  version: "1.0.0",
  author: "Mahin+ ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} - Shows bot's response speed"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID } = event;
  const start = Date.now();

  const loadingMsg = await api.sendMessage("🏓 Pinging...", threadID);

  const ping = Date.now() - start;

  let rating = "📶 Fast";
  if (ping >= 200) rating = "⚠️ Medium";
  if (ping >= 400) rating = "🐢 Slow";

  const message = `
🎯 𝙿𝙸𝙽𝙶 𝚃𝙴𝚂𝚃 🎯

🔂 Pong returned in: ${ping}ms
📡 Speed Status: ${rating}
💬 Bot is online and active!

🔹 Keep calm and chat on. 💙
  `.trim();

  api.editMessage(message, loadingMsg.messageID, threadID);
};
