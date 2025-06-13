const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "smiley",
    version: "3.0",
    author: "Dbz_Mahin",
    role: 0,
    shortDescription: "Auto-response to 🙂 emoji",
    longDescription: "Sends special message and image when someone sends 🙂",
    category: "fun",
    guide: {
      en: "Just type 🙂 and the bot will respond automatically"
    }
  },

  onStart: async function ({ api, event }) {
    // This prevents the "command" style usage
    api.sendMessage("✨ This command works automatically when you send the 🙂 emoji!", event.threadID);
  },

  onChat: async function ({ api, event }) {
    try {
      if (event.body?.trim() === "🙂") {
        // Add heart reaction
        api.setMessageReaction("❤️", event.messageID, () => {}, true);
        
        // ===== CHANGE THIS TO YOUR IMGUR IMAGE URL =====
        const imageUrl = "https://i.imgur.com/SkvCj9N.jpeg"; // Replace with your Imgur link
        // ==============================================
        
        const cachePath = path.join(__dirname, 'cache');
        if (!fs.existsSync(cachePath)) {
          fs.mkdirSync(cachePath, { recursive: true });
        }
        
        const imagePath = path.join(cachePath, `smiley_${event.messageID}.jpg`);
        
        try {
          // Download the image
          const response = await axios.get(imageUrl, { 
            responseType: 'arraybuffer',
            timeout: 15000
          });
          
          fs.writeFileSync(imagePath, Buffer.from(response.data));
          
          // Send the formatted message with image
          await api.sendMessage({
            body: `╭•┄┅════❁✨❁════┅┄•╮\n\n         Baby amon koro kano?😭\n\n╰•┄┅════❁🌊❁════┅┄•╯`,
            attachment: fs.createReadStream(imagePath)
          }, event.threadID);
          
        } catch (error) {
          console.error("Image download failed:", error);
          // Fallback to text-only response
          await api.sendMessage(
            `╭•┄┅════❁✨❁════┅┄•╮\n\n         Baby amon koro kano?😭\n\n╰•┄┅════❁🌊❁════┅┄•╯\n\n[Image could not be loaded]`,
            event.threadID
          );
        } finally {
          // Clean up downloaded file if it exists
          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
              if (err) console.error("Error deleting image:", err);
            });
          }
        }
      }
    } catch (error) {
      console.error("Error in smiley command:", error);
      api.sendMessage("An error occurred while processing your smiley 😔", event.threadID);
    }
  }
};
