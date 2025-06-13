module.exports.config = {
  name: "prefix2",
  version: "1.0.1",
  author: "Jan + ChatGPT",
  role: 0,
  category: "info",
  shortDescription: "Show prefix and admin info",
  longDescription: "Display global and group prefix with admin and Facebook details",
  guide: {
    en: "Just type: prefix2, pf2, pre2 or pfx2 (no prefix needed)"
  }
};

module.exports.handleEvent = async function ({ event, api }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const lowerBody = body.toLowerCase().trim();
  const triggers = ["prefix2", "pf2", "pre2", "pfx2"];

  if (!triggers.includes(lowerBody)) return;

  const globalPrefix = global.config.PREFIX || "!";
  const groupPrefix = global.data?.threadData?.get(threadID)?.PREFIX || globalPrefix;

  const msg = `
🌎 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱: ${globalPrefix}
📚 𝐘𝐨𝐮𝐫 𝐆𝐫𝐨𝐮𝐩 𝐏𝐫𝐞𝐟𝐢𝐱: ${groupPrefix}

╭‣ 𝐀𝐝𝐦𝐢𝐧 👑
╰‣ DBZ_MAHIN

╭‣ 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 ⓕ
╰‣ https://www.facebook.com/mdmahin.2026cr7wc
`.trim();

  return api.sendMessage(msg, threadID, messageID);
};

module.exports.onStart = async function () {
  // Not used since this command is event-triggered.
};
