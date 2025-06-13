const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "waifutalk",
    version: "1.0",
    author: "Dbz_Mahin", 
    role: 0,
    countDown: 5,
    shortDescription: "AI Waifu Therapist",
    longDescription: "Get emotional support from anime character AIs",
    category: "ai",
    guide: {
      en: "{p}waifutalk [message] -[character]\nCharacters: rem, marin, miku, zero2"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      // Parse arguments
      const input = args.join(" ");
      const [message, characterArg] = input.split("-").map(s => s.trim());
      const character = characterArg || 'rem'; // Default to Rem

      // Character database
      const characters = {
        rem: {
          name: "Rem (Re:Zero)",
          prompt: "You are Rem from Re:Zero acting as an emotional support therapist. Respond cutely but professionally to user problems."
        },
        marin: {
          name: "Marin Kitagawa",
          prompt: "You're Marin from My Dress-Up Darling giving cheerful life advice. Use ~nyan at sentence ends sometimes."
        },
        miku: {
          name: "Hatsune Miku",
          prompt: "Respond as virtual singer Miku giving advice through song lyrics and metaphors."
        },
        zero2: {
          name: "Zero Two",
          prompt: "You're Zero Two from Darling in the FranXX. Flirtatious but caring responses with darling~ at the end."
        }
      };

      if (!characters[character]) {
        return api.sendMessage(
          `Invalid character! Available:\n${Object.keys(characters).map(c => `-${c}`).join("\n")}`,
          event.threadID
        );
      }

      // Typing indicator
      api.sendTypingIndicator(event.threadID);

      // Call AI API
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: characters[character].prompt
        }, {
          role: "user",
          content: message
        }],
        temperature: 0.7,
        max_tokens: 150
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_KEY`,
          'Content-Type': 'application/json'
        }
      });

      // Send response
      const aiResponse = response.data.choices[0].message.content;
      const finalMessage = `💬 ${characters[character].name} says:\n\n${aiResponse}\n\n[Type another message to continue chatting]`;

      api.sendMessage(finalMessage, event.threadID);

    } catch (error) {
      console.error('[WAIFUTALK ERROR]', error);
      api.sendMessage("❌ My circuits overloaded from your kawaii energy~ Try again later!", event.threadID);
    }
  }
};
