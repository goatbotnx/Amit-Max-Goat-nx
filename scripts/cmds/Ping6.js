const os = require("os");

module.exports.config = {
  name: "ping6",
  aliases: ["p6", "lat6", "pong6", "speed6"],
  version: "1.0.0",
  author: "Jan + ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} - Diagnostic-style ping & bot health check"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID } = event;
  const start = Date.now();

  // Step 1: Show diagnostic animation
  const initialMsg = await api.sendMessage("🧠 Initializing system diagnostics...", threadID);
  await new Promise(resolve => setTimeout(resolve, 500));
  await api.editMessage("⚙️ Scanning subsystems...", initialMsg.messageID, threadID);
  await new Promise(resolve => setTimeout(resolve, 500));
  await api.editMessage("🔍 Measuring ping latency...", initialMsg.messageID, threadID);

  const ping = Date.now() - start;

  // Step 2: Ping bar
  const bar =
    ping < 100 ? "🟢🟢🟢🟢🟢" :
    ping < 200 ? "🟢🟢🟡🟡⬜" :
    ping < 400 ? "🟡🟡🟡⬜⬜" :
    "🔴🔴⬜⬜⬜";

  // Step 3: System metrics
  const load = os.loadavg()[0].toFixed(2);
  const totalMem = os.totalmem() / 1024 / 1024;
  const usedMem = (totalMem - os.freemem() / 1024 / 1024).toFixed(1);
  const mood = load < 1 ? "😊 Stable" : load < 2 ? "😐 Mild Load" : "😵 Overloaded";

  // Final message
  const message = `
╔═══📡 𝗣𝗜𝗡𝗚 𝟲 – 𝗗𝗶𝗮𝗴𝗻𝗼𝘀𝘁𝗶𝗰 𝗥𝗲𝗽𝗼𝗿𝘁 ═══╗

⏱️ 𝗟𝗮𝘁𝗲𝗻𝗰𝘆: ${ping}ms
📊 𝗦𝗽𝗲𝗲𝗱 𝗕𝗮𝗿: ${bar}
🧠 𝗕𝗼𝘁 𝗠𝗼𝗼𝗱: ${mood}

🖥️ 𝗖𝗣𝗨 𝗟𝗼𝗮𝗱: ${load}
💾 𝗠𝗲𝗺𝗼𝗿𝘆: ${usedMem}MB / ${totalMem.toFixed(1)}MB

📡 𝗦𝘆𝘀𝘁𝗲𝗺 𝗦𝘁𝗮𝘁𝘂𝘀: ✅ 𝗢𝗡𝗟𝗜𝗡𝗘

╚═══════════════════════════╝
  `.trim();

  api.editMessage(message, initialMsg.messageID, threadID);
};
