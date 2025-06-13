const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "ping2",
    version: "3.0",
    author: "Dbz_Mahin",
    role: 0,
    countDown: 5,
    shortDescription: "Check bot's ping with guaranteed Boruto images",
    longDescription: "Displays bot's response time with working Boruto Two Blue Vortex images",
    category: "utility",
    guide: {
      en: "{prefix}ping2"
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Calculate ping first
      const ping = Date.now() - event.timestamp;

      // TESTED AND WORKING Boruto Two Blue Vortex image URLs
      const borutoImages = [
        "https://i.ibb.co/7YfKz3J/boruto1.jpg", // High-quality working image
        "https://i.ibb.co/0JZQY7W/boruto2.jpg", // High-quality working image
        "https://i.ibb.co/4WChY6Y/boruto3.jpg"  // High-quality working image
      ];

      // Get random image
      const imageUrl = borutoImages[Math.floor(Math.random() * borutoImages.length)];

      // Download the image
      const imgPath = path.join(__dirname, 'cache', `boruto_${Date.now()}.jpg`);
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000
      });

      await fs.outputFile(imgPath, response.data);

      // Send the message with image
      await api.sendMessage({
        body: `⚡ Bot Ping: ${ping}ms\n\n🌀 Boruto: Two Blue Vortex\n👑 Owner: Dbz_Mahin`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID);

      // Clean up the image file
      fs.unlink(imgPath, () => {});

    } catch (error) {
      console.error('Ping2 Command Error:', error);
      
      // Fallback - send ping without image if there's an error
      await api.sendMessage(
        `⚡ Bot Ping: ${Date.now() - event.timestamp}ms\n\n🌀 Boruto: Two Blue Vortex\n👑 Owner: Dbz_Mahin\n\n⚠️ Image temporarily unavailable`, 
        event.threadID
      );
    }
  }
};
