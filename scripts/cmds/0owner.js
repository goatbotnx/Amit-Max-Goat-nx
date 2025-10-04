const { getStreamFromURL } = require("fb-watchman");

module.exports = {
  config: {
    name: "owner",
    version: 2.0,
    author: "ツ",
    longDescription: "info about bot and owner",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ api, event, args, message, usersData }) {
    const imgURL = "https://i.ibb.co/0RsQCX8v/received-1848769335994184.jpg";
    const attachment = await global.utils.getStreamFromURL(imgURL);

    const id = event.senderID;
    const userData = await usersData.get(id);
    const name = userData.name;

    const ment = [{ id: id, tag: name }];
    
    const a = "NEGATIVE BOT BY TBT";
    const b = "/"; // Prefix
    const c = "〲NEGATIVE XALMANツ";
    const e = "Male";
    const f = "𝟏𝟖";
    const g = "𝐒𝐢𝐧𝐠𝐥𝐞";
    const h = "continues work";
    const i = "Narsingdi";
    const d = "N/A";

    message.reply({ 
      body: `᯽ ${name} ᯽

᯽Bot's Name: ${a}
᯽ Bot's prefix: ${b}  
᯽Owner: ${c}
᯽ Gender: ${e}
᯽ Owners Messenger: ${d}
᯽ Age: ${f}
᯽ Relationship: ${g}
᯽Class: ${h}
᯽ Basa: ${i}`,
      mentions: ment,
      attachment: attachment
    });
  }
};
