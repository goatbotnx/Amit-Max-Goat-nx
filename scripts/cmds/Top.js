/cmd install top.js module.exports = {
  config: {
    name: "top",
    version: "2.1",
    author: "Dbz_Mahin",
    category: "economy",
    shortDescription: {
      en: "💰 View top richest with luxurious design"
    },
    longDescription: {
      en: "🌟 Display the wealth leaderboard with stunning visual style"
    },
    guide: {
      en: "{pn} [number] - Show top richest (default: 10)"
    },
    role: 0
  },

  onStart: async function ({ message, usersData, args }) {
    try {
      // Get all users' data
      const allUserData = await usersData.getAll();
      
      // Filter and sort users by money
      const sortedUsers = allUserData
        .filter((user) => !isNaN(user.money) && user.money > 0)
        .sort((a, b) => b.money - a.money);

      // Determine how many users to show
      const topCount = Math.min(parseInt(args[0]) || 10, sortedUsers.length);
      
      if (sortedUsers.length === 0) {
        return message.reply("💸 No wealthy users found in the database.");
      }

      // Create stylish message header
      let msg = `✨══════  《💰 TOP ${topCount} RICHEST 💰》 ══════✨\n\n`;
      
      // Add each user with luxurious formatting
      sortedUsers.slice(0, topCount).forEach((user, index) => {
        const rank = getRankEmoji(index + 1);
        const formattedBalance = formatNumberWithFullForm(user.money);
        const progressBar = createProgressBar(user.money / sortedUsers[0].money * 100);
        const userDecor = getUserDecoration(index + 1);
        
        msg += `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n`;
        msg += `  ${rank} ${index + 1}. ${userDecor} ${user.name} ${userDecor}\n`;
        msg += `  ├─❖ Balance: $ ${formattedBalance}\n`;
        msg += `  ├─⏣ Progress: ${progressBar}\n`;
        msg += `  └─⚝ Wealth Tier: ${getWealthTier(user.money)}\n`;
      });

      // Add footer statistics
      msg += `\n⚜️══════  《 ECONOMY STATS 》 ══════⚜️\n`;
      msg += `👑 Richest: ${sortedUsers[0].name} ($ ${formatNumberWithFullForm(sortedUsers[0].money)})\n`;
      msg += `📊 Total Participants: ${sortedUsers.length}\n`;
      msg += `💎 Total Wealth: $ ${formatNumberWithFullForm(sortedUsers.reduce((sum, user) => sum + user.money, 0))}\n`;
      msg += `✨══════  《 Powered by Yu Ri 》 ══════✨`;

      message.reply({
        body: msg,
        mentions: sortedUsers.slice(0, topCount).map(user => ({
          id: user.id,
          tag: user.name
        }))
      });

    } catch (error) {
      console.error("Error in top command:", error);
      message.reply("❌ An error occurred while fetching wealth data.");
    }
  }
};

// Helper function to create a progress bar
function createProgressBar(percentage, length = 20) {
  const filled = Math.round(percentage / 100 * length);
  const empty = length - filled;
  return '▰'.repeat(filled) + '▱'.repeat(empty) + ` ${percentage.toFixed(1)}%`;
}

// Helper function to get rank emoji
function getRankEmoji(rank) {
  const emojis = {
    1: "👑",
    2: "🌟",
    3: "⭐",
    default: "🔸"
  };
  return emojis[rank] || emojis.default;
}

// Function to get user decoration based on rank
function getUserDecoration(rank) {
  const decorations = {
    1: "💎✨💎",
    2: "🌟⚡🌟",
    3: "⭐🔥⭐",
    default: "◈"
  };
  return decorations[rank] || decorations.default;
}

// Function to determine wealth tier
function getWealthTier(money) {
  if (money >= 1e15) return "Dragon Lord 💸🐉";
  if (money >= 1e12) return "Ultra Rich 💎🏆";
  if (money >= 1e9) return "Millionaire 💰🎩";
  if (money >= 1e6) return "Wealthy 🏦💵";
  if (money >= 1e3) return "Comfortable 💳🏠";
  return "Beginner 🏁";
}

// Function to format a number with full forms
function formatNumberWithFullForm(number) {
  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
  let suffixIndex = 0;
  
  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + suffixes[suffixIndex];
}
