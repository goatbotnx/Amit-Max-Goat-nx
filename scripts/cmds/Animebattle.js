const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "animebattle",
    version: "1.0",
    author: "Dbz_Mahin",
    role: 0,
    countDown: 10,
    shortDescription: "Anime character battle simulator",
    longDescription: "Simulate epic battles between anime characters with physics and special moves",
    category: "games",
    guide: {
      en: "{p}animebattle [character1] vs [character2]\nExample: {p}animebattle goku vs naruto"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const input = args.join(" ").split(" vs ");
      if (input.length < 2) {
        return api.sendMessage("Please specify 2 characters!\nExample: !animebattle goku vs vegeta", event.threadID);
      }

      const [char1, char2] = input.map(c => c.trim());
      
      // Character stats database
      const characters = {
        goku: { power: 9500, special: "Kamehameha", winRate: 0.7 },
        vegeta: { power: 9000, special: "Final Flash", winRate: 0.65 },
        naruto: { power: 8500, special: "Rasengan", winRate: 0.6 },
        sasuke: { power: 8400, special: "Chidori", winRate: 0.58 },
        luffy: { power: 8800, special: "Gomu Gomu no Jet Gatling", winRate: 0.62 },
        zoro: { power: 8200, special: "Santoryu Ougi", winRate: 0.55 }
      };

      // Validate characters
      if (!characters[char1.toLowerCase()] || !characters[char2.toLowerCase()]) {
        return api.sendMessage(`Invalid characters! Available:\n${Object.keys(characters).join(", ")}`, event.threadID);
      }

      // Battle simulation
      const battleOutcome = simulateBattle(
        characters[char1.toLowerCase()], 
        characters[char2.toLowerCase()]
      );

      // Generate battle image
      const imgPath = await generateBattleImage(char1, char2, battleOutcome.winner);

      // Send results
      await api.sendMessage({
        body: `⚔️ ${char1.toUpperCase()} vs ${char2.toUpperCase()}\n\n` +
              `💥 ${battleOutcome.moves.join("\n💥 ")}\n\n` +
              `🏆 Winner: ${battleOutcome.winner} with ${battleOutcome.finalMove}!` +
              `\n\nDamage Dealt: ${battleOutcome.damage}`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID);

      // Cleanup
      fs.unlink(imgPath, () => {});

    } catch (error) {
      console.error('[BATTLE ERROR]', error);
      api.sendMessage("The battle crashed harder than Toei Animation's servers! Try again~", event.threadID);
    }
  }
};

// Battle physics engine
function simulateBattle(char1, char2) {
  const moves = [];
  let hp1 = 100, hp2 = 100;
  
  // Battle rounds
  for (let i = 0; i < 3; i++) {
    const damage1 = Math.floor(Math.random() * char1.power / 100);
    const damage2 = Math.floor(Math.random() * char2.power / 100);
    
    hp2 -= damage1;
    hp1 -= damage2;
    
    moves.push(
      `${char1.name} uses ${i === 2 ? char1.special : "normal attack"} (${damage1} damage)` +
      ` | ${char2.name} uses ${i === 2 ? char2.special : "normal attack"} (${damage2} damage)`
    );
    
    if (hp1 <= 0 || hp2 <= 0) break;
  }

  // Determine winner
  const winner = hp1 > hp2 ? char1.name : char2.name;
  const finalMove = hp1 > hp2 ? char1.special : char2.special;
  
  return {
    winner,
    finalMove,
    moves,
    damage: `${100-hp1}% vs ${100-hp2}%`
  };
}

// Generate battle image (placeholder implementation)
async function generateBattleImage(char1, char2, winner) {
  const imgPath = path.join(__dirname, 'cache', `battle_${Date.now()}.jpg`);
  
  // In reality, you'd call an image generation API here
  // For now we'll use a placeholder
  const placeholderUrl = "https://i.imgur.com/8QZqX7y.jpg"; // Battle image template
  const response = await axios.get(placeholderUrl, { responseType: 'arraybuffer' });
  await fs.outputFile(imgPath, response.data);
  
  return imgPath;
}
