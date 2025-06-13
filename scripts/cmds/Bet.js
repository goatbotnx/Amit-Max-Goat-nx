module.exports.config = {
  name: "bet",
  aliases: ["slot", "spin"],
  version: "1.0.0",
  author: "Mahin",
  role: 0,
  countDown: 5,
  category: "fun",
  guide: {
    en: "{pn} – Spin the slot machine and try your luck!"
  }
};

module.exports.onStart = async function ({ api, event }) {
  const { threadID, messageID } = event;

  const symbols = ["🍒", "🍋", "🍉", "⭐", "💎", "🍇"];
  const spin = () => symbols[Math.floor(Math.random() * symbols.length)];

  const slot1 = spin();
  const slot2 = spin();
  const slot3 = spin();

  const slots = [slot1, slot2, slot3];
  const display = `🎰 | ${slot1} | ${slot2} | ${slot3} | 🎰`;

  let result = "";

  if (slot1 === slot2 && slot2 === slot3) {
    result = "💰 JACKPOT! You got all three! 🎉";
  } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
    result = "🔥 Nice! You got two matching!";
  } else {
    result = "😢 No match. Better luck next time!";
  }

  const finalMessage = `${display}\n\n${result}`;

  api.sendMessage(finalMessage, threadID, null, messageID);
};
