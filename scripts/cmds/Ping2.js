const axios = require('axios');

module.exports = {
  config: {
    name: "ping2",
    version: "3.1",
    author: "nx",
    role: 0,
    countDown: 5,
    shortDescription: "Check bot's ping",
    longDescription: "Displays bot's response time without images",
    category: "utility",
    guide: {
      en: "{prefix}ping2"
    }
  },

  onStart: async function({ api, event }) {
    try {
      // Calculate ping
      const ping = Date.now() - event.timestamp;

      // Send ping result (no image)
      await api.sendMessage(
        `⚡ Bot Ping: ${ping}ms\n\n🌀 Boruto: Two Blue Vortex\n👑 Owner: Mâybê Nx`,
        event.threadID
      );

    } catch (error) {
      console.error('Ping2 Command Error:', error);
      await api.sendMessage(
        `⚠️ Something went wrong!\n\n⚡ Bot Ping: ${Date.now() - event.timestamp}ms`,
        event.threadID
      );
    }
  }
};
