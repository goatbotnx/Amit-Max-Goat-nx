const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "spy2",
    aliases: ["profile2", "userinfo2"],
    version: "1.0",
    author: "Mahin",
    role: 0,
    shortDescription: { en: "Display user profile in stylish format" },
    longDescription: { en: "Show detailed user information with ranking stats" },
    category: "utility",
    guide: { en: "{pn} [@mention|userID]" }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      let targetID;
      // Check if there's a mention or specified userID
      if (Object.keys(event.mentions).length > 0) {
        targetID = Object.keys(event.mentions)[0];
      } else if (args[0]) {
        targetID = args[0];
      } else {
        targetID = event.senderID;
      }

      // Get user data (in a real implementation, you'd fetch from your database)
      const userData = await usersData.get(targetID);
      const username = await getUserName(api, targetID);

      // Generate random stats (replace with actual data from your system)
      const stats = {
        nickname: "none",
        gender: Math.random() > 0.5 ? "Boy" : "Girl",
        uid: targetID,
        class: "FRIEND",
        birthday: "Private",
        username: username.replace(/\s/g, '.') + ".123",
        botFriend: Math.random() > 0.7 ? "Yes✅" : "No❌",
        rankLevel: Math.floor(Math.random() * 100) + 1,
        rankPosition: Math.floor(Math.random() * 100) + 1,
        balance: (Math.random() * 20).toFixed(1) + "M",
        balanceRank: Math.floor(Math.random() * 50) + 1,
        flagWins: Math.floor(Math.random() * 50),
        flagRank: Math.floor(Math.random() * 50) + 1,
        waifuWins: Math.floor(Math.random() * 20),
        waifuRank: Math.floor(Math.random() * 50) + 1,
        quizWins: Math.floor(Math.random() * 200),
        quizRank: Math.floor(Math.random() * 50) + 1,
        animeQuizWins: Math.floor(Math.random() * 20),
        animeQuizRank: Math.floor(Math.random() * 50) + 1,
        teachCount: Math.floor(Math.random() * 600),
        teachRank: Math.floor(Math.random() * 50) + 1
      };

      // Build the stylish profile message
      const profileMessage = [
        `╭──── [👑 ${username}]`,
        `├‣ 🧸 𝐍𝐢𝐜𝐤𝐍𝐚𝐦𝐞: ${stats.nickname}`,
        `├‣ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫: ${stats.gender}`,
        `├🆔 𝐔𝐢𝐝: ${stats.uid}`,
        `├🎓 𝐂𝐥𝐚𝐬𝐬: ${stats.class}`,
        `├🎂 𝐁𝐢𝐫𝐭𝐡𝐝𝐚𝐲: ${stats.birthday}`,
        `├📛 𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞: ${stats.username}`,
        `╰🤖 𝐁𝐨𝐭 𝐅𝐫𝐢𝐞𝐧𝐝: ${stats.botFriend}\n`,
        
        `╭──── [🏅𝐑𝐚𝐧𝐤 ]`,
        `├📈 𝐑𝐚𝐧𝐤 𝐋𝐞𝐯𝐞𝐥: ${stats.rankLevel}`,
        `╰🥇 𝐑𝐚𝐧𝐤 Ranking: ${stats.rankPosition}\n`,
        
        `╭──── [💰 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 ]`,
        `├💵 𝐁𝐚𝐥𝐚𝐧𝐜𝐞: ${stats.balance}`,
        `╰📉 𝐁𝐚𝐥𝐚𝐧𝐜𝐞 Ranking: ${stats.balanceRank}\n`,
        
        `╭──── [🚩 𝐅𝐥𝐚𝐠 𝐆𝐚𝐦𝐞 ]`,
        `├🏁 𝐅𝐥𝐚𝐠 𝐖𝐢𝐧𝐬: ${stats.flagWins}`,
        `╰🎖 𝐅𝐥𝐚𝐠 Ranking: ${stats.flagRank}\n`,
        
        `╭──── [💘 𝐖𝐚𝐢𝐟𝐮 𝐆𝐚𝐦𝐞 ]`,
        `├❤ 𝐖𝐚𝐢𝐟𝐮 𝐖𝐢𝐧𝐬: ${stats.waifuWins}`,
        `╰👑 𝐖𝐚𝐢𝐟𝐮 Ranking: ${stats.waifuRank}\n`,
        
        `╭──── [🧠 𝐐𝐮𝐢𝐳 𝐆𝐚𝐦𝐞 ]`,
        `├📚 𝐐𝐮𝐢𝐳 𝐖𝐢𝐧𝐬: ${stats.quizWins}`,
        `╰🏆 𝐐𝐮𝐢𝐳 Ranking: ${stats.quizRank}\n`,
        
        `╭──── [🎌 𝐀𝐧𝐢𝐦𝐞 𝐐𝐮𝐢𝐳 ]`,
        `├🎴 𝐀𝐧𝐢𝐦𝐞 𝐐𝐮𝐢𝐳 𝐖𝐢𝐧𝐬: ${stats.animeQuizWins}`,
        `╰🎯 𝐀𝐧𝐢𝐦𝐞 Ranking: ${stats.animeQuizRank}\n`,
        
        `╭──── [📚 jan teacher ]`,
        `├✍ jan teach: ${stats.teachCount}`,
        `╰🎓 𝚃𝚎𝚊𝚌𝚑 Ranking: ${stats.teachRank}`
      ].join('\n');

      api.sendMessage(profileMessage, event.threadID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ An error occurred while fetching user data.", event.threadID);
    }
  }
};

// Helper function to get username
async function getUserName(api, userID) {
  try {
    const userInfo = await api.getUserInfo(userID);
    return userInfo[userID].name || "Unknown";
  } catch {
    return "Unknown";
  }
}
