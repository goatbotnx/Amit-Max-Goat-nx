const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "ss",
    aliases: ["screenshot", "webshot"],
    version: "1.0",
    author: "Dbz_Mahin",
    role: 0,
    countDown: 15,
    shortDescription: {
      en: "Take website screenshot"
    },
    longDescription: {
      en: "Capture screenshot of any website URL"
    },
    category: "utility",
    guide: {
      en: "{prefix}ss [url] (options)\nExample: {prefix}ss https://google.com\nOptions:\n-full (for full page screenshot)\n-mobile (mobile view)"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (args.length === 0) {
        return api.sendMessage(
          `⚠️ Please provide a URL. Example: ${global.GoatBot.config.prefix}ss https://google.com`,
          event.threadID,
          event.messageID
        );
      }

      let url = args[0];
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }

      const options = {
        full: args.includes('-full'),
        mobile: args.includes('-mobile')
      };

      api.sendMessage(`📸 Taking screenshot of ${url}...`, event.threadID, event.messageID);

      const apiUrl = `https://image.thum.io/get/width/1200/crop/800/${options.full ? 'full/' : ''}${options.mobile ? 'userAgent/Mobile/' : ''}${url}`;
      
      const response = await axios.get(apiUrl, {
        responseType: 'arraybuffer'
      });

      const imgPath = path.join(__dirname, 'cache', `webshot_${Date.now()}.jpg`);
      await fs.outputFile(imgPath, response.data);

      await api.sendMessage({
        body: `🖥️ Screenshot of ${url}`,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID);

      fs.unlink(imgPath, () => {});

    } catch (error) {
      console.error("Screenshot error:", error);
      api.sendMessage(
        `❌ Failed to capture screenshot. Please check:\n1. The URL is valid\n2. The website allows screenshots\n3. Try again later`,
        event.threadID,
        event.messageID
      );
    }
  }
};
