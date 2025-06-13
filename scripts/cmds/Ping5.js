module.exports.config = {
  name: "ping5",
  aliases: ["p5", "speed5", "pong5", "latency5"],
  version: "1.0.0",
  author: "Jan + ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} - Fancy animated ping with status bars"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID } = event;

  // Start timing
  const start = Date.now();

  // Send animated-style dots first
  const loadingMsg = await api.sendMessage("⏳ Connecting to bot core", threadID);
  await new Promise(resolve => setTimeout(resolve, 300));
  await api.editMessage("⏳ Connecting to bot core.", loadingMsg.messageID, threadID);
  await new Promise(resolve => setTimeout(resolve, 300));
  await api.editMessage("⏳ Connecting to bot core..", loadingMsg.messageID, threadID);
  await new Promise(resolve => setTimeout(resolve, 300));
  await api.editMessage("⏳ Connecting to bot core...", loadingMsg.messageID, threadID);

  const ping = Date.now() - start;

  // Speed Rating + Visual Meter
  let speedStatus = "";
  let meter = "";
  if (ping < 100) {
    speedStatus = "⚡ Ultra Fast";
    meter = "🟩🟩🟩🟩🟩";
  } else if (ping < 200) {
    speedStatus = "✨ Moderate";
    meter = "🟩🟩🟨🟨⬜";
  } else if (ping < 400) {
    speedStatus = "⚠️ Slow";
    meter = "🟨🟨🟨⬜⬜";
  } else {
    speedStatus = "🐢 Lagging";
    meter = "🟥🟥⬜⬜⬜";
  }

  // Final fancy message
  const finalMessage = `
╔═━━━✦✦✦ 𝗣𝗜𝗡𝗚 𝟱 ✦✦✦━━━═╗

🕒 𝗧𝗶𝗺𝗲 𝗧𝗼 𝗥𝗲𝗮𝗰𝘁: ${ping}ms
📶 𝗦𝗽𝗲𝗲𝗱 𝗥𝗮𝘁𝗶𝗻𝗴: ${speedStatus}

📊 𝗣𝗶𝗻𝗴 𝗠𝗲𝘁𝗲𝗿:
${meter}

✅ 𝗕𝗼𝘁 𝗜𝘀 𝗔𝗰𝘁𝗶𝘃𝗲 & 𝗥𝗲𝗮𝗱𝘆!

╚═━━━━━━━━━━━━━━━━━━═╝
  `.trim();

  // Send final result
  api.editMessage(finalMessage, loadingMsg.messageID, threadID);
};
