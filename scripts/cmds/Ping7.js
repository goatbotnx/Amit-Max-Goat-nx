const moment = require("moment-timezone");

module.exports.config = {
  name: "ping7",
  aliases: ["p7", "waveping", "lat7", "dangerping"],
  version: "1.0.0",
  author: "Jan + ChatGPT",
  role: 0,
  category: "system",
  guide: {
    en: "{pn} - Epic animated ping + danger alert ⚠️"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID } = event;

  const start = Date.now();

  // Step 1: Animated wave
  const loading = await api.sendMessage("🌊 Ping wave sending", threadID);
  const dots = [".", "..", "...", "....", "....."];
  for (let i = 0; i < dots.length; i++) {
    await new Promise(r => setTimeout(r, 250));
    await api.editMessage(`🌊 Ping wave sending${dots[i]}`, loading.messageID, threadID);
  }

  const ping = Date.now() - start;

  // Step 2: Time of day
  const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

  // Step 3: Danger warning if ping > 800ms
  let status = "🟢 Smooth";
  let emoji = "🌈";
  if (ping >= 800) {
    status = "🔴 DANGER MODE";
    emoji = "💣💥";
  } else if (ping >= 400) {
    status = "🟡 Laggy";
    emoji = "🌀";
  } else if (ping >= 200) {
    status = "🟠 Moderate";
    emoji = "⚡";
  }

  const waves = Math.min(Math.floor(ping / 100), 5);
  const waveBar = "🌊".repeat(waves) + "▫️".repeat(5 - waves);

  // Step 4: Final styled message
  const msg = `
╔═══✦⚙️ 𝗣𝗜𝗡𝗚 𝟳 – 𝗪𝗔𝗩𝗘 𝗠𝗢𝗗𝗘 ⚙️✦═══╗

🕒 𝗧𝗶𝗺𝗲 𝗼𝗳 𝗧𝗲𝘀𝘁: ${time}
📡 𝗟𝗮𝘁𝗲𝗻𝗰𝘆: ${ping}ms
📈 𝗦𝗽𝗲𝗲𝗱 𝗪𝗮𝘃𝗲: ${waveBar}
⚠️ 𝗦𝘁𝗮𝘁𝘂𝘀: ${status} ${emoji}

🧠 𝗕𝗼𝘁 𝗠𝗶𝗻𝗱: Awake & Aware
🎯 𝗢𝗽𝗲𝗿𝗮𝘁𝗶𝗼𝗻𝗮𝗹 ✔️

╚══════════════════════╝
  `.trim();

  api.editMessage(msg, loading.messageID, threadID);
};
