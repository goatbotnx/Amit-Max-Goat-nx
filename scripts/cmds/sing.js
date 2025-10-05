const axios = require("axios");
const ytdl = require("@distube/ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sing",
    aliases: ["song", "music"],
    version: "2.5",
    author: "xalman & GPT-5",
    countDown: 3,
    role: 0,
    shortDescription: {
      en: "🎵 Search and play songs from YouTube"
    },
    longDescription: {
      en: "✨ Search for any song on YouTube and send the audio file."
    },
    category: "music",
    guide: {
      en: "{p}sing <song name>"
    }
  },

  onStart: async function({ message, args }) {
    const query = args.join(" ");
    if (!query)
      return message.reply("❗Please provide a song name to search.");

    try {
      message.reply(`🔍 Searching for **${query}**, please wait...`);

      const searchUrl = `https://yt-api.vercel.app/api/search?query=${encodeURIComponent(query)}`;
      const { data } = await axios.get(searchUrl);

      if (!data || !data.videos || !data.videos.length)
        return message.reply("❌ No songs found. Try another name.");

      const song = data.videos[0];
      const audioUrl = `https://yt-api.vercel.app/api/download/audio?id=${song.videoId}`;
      const filePath = path.join(__dirname, "sing.mp3");

      const response = await axios({
        url: audioUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: `🎶 Now playing: ${song.title}\n📺 ${song.url}`,
          attachment: fs.createReadStream(filePath)
        });
      });

      writer.on("error", () => {
        message.reply("❌ Failed to process audio file.");
      });

    } catch (e) {
      console.error(e);
      message.reply("❌ Unable to fetch songs. Please try again later.");
    }
  }
};
