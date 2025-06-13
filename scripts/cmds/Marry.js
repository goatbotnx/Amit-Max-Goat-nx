const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "marry",
    version: "3.0",
    author: "Mahin",
    role: 0,
    shortDescription: "Get married in chat",
    longDescription: "Propose and accept marriage with other users",
    category: "fun",
    guide: {
      en: "{p}marry @user - Propose marriage\n{p}marry accept @user - Accept proposal"
    }
  },

  onStart: async function ({ api, event, args, usersData }) {
    try {
      const { threadID, senderID, messageReply, mentions } = event;
      
      // Ensure data directory exists
      const dataDir = path.join(__dirname, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      const marriagesPath = path.join(dataDir, 'marriages.json');
      let marriages = {};
      
      // Load existing marriages
      if (fs.existsSync(marriagesPath)) {
        marriages = JSON.parse(fs.readFileSync(marriagesPath));
      }

      // Get target user
      let targetID;
      if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
      } else if (messageReply) {
        targetID = messageReply.senderID;
      } else {
        return api.sendMessage("❌ Please mention or reply to the user you want to marry!", threadID);
      }

      // Validation checks
      if (targetID === senderID) {
        return api.sendMessage("❌ You can't marry yourself!", threadID);
      }

      // Check if already married
      if (marriages[senderID]?.spouse === targetID) {
        const spouseName = await usersData.getName(targetID);
        return api.sendMessage(`💖 You're already married to ${spouseName}!`, threadID);
      }

      // Handle proposal acceptance
      if (args[0]?.toLowerCase() === 'accept') {
        if (!marriages[targetID] || marriages[targetID].proposedTo !== senderID) {
          return api.sendMessage("❌ You don't have a pending proposal from this user!", threadID);
        }

        // Create marriage
        const weddingDate = new Date().toLocaleString();
        marriages[senderID] = {
          spouse: targetID,
          since: weddingDate
        };
        marriages[targetID] = {
          spouse: senderID,
          since: weddingDate
        };

        // Remove proposal status
        delete marriages[senderID].proposedTo;
        delete marriages[targetID].proposedTo;

        // Save to file
        fs.writeFileSync(marriagesPath, JSON.stringify(marriages, null, 2));

        const [userName, spouseName] = await Promise.all([
          usersData.getName(senderID),
          usersData.getName(targetID)
        ]);

        return api.sendMessage(
          `💍 Marriage Successful! 💒\n\n` +
          `✨ ${userName} ❤️ ${spouseName} ✨\n` +
          `📅 Married since: ${weddingDate}\n\n` +
          `💕 May you live happily ever after!`,
          threadID
        );
      }

      // Create new proposal
      marriages[senderID] = {
        proposedTo: targetID
      };
      
      fs.writeFileSync(marriagesPath, JSON.stringify(marriages, null, 2));

      const [userName, targetName] = await Promise.all([
        usersData.getName(senderID),
        usersData.getName(targetID)
      ]);

      return api.sendMessage(
        `💌 Marriage Proposal! 💍\n\n` +
        `${userName} has proposed to ${targetName}!\n\n` +
        `To accept, reply with:\n` +
        `"${this.config.prefix}marry accept @${userName}"\n\n` +
        `💝 The proposal will expire in 24 hours`,
        threadID
      );

    } catch (error) {
      console.error('Marriage command error:', error);
      return api.sendMessage("❌ An error occurred while processing your request. Please try again later.", event.threadID);
    }
  }
};
