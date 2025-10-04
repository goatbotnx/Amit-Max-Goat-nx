const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

function wrap(text) {
  return ' ' + text + '√';
}

var boxEmojis = ["•"];
var cmdEmojis = [""];

function randomEmoji() {
  return cmdEmojis[Math.floor(Math.random() * cmdEmojis.length)];
}

module.exports = {
  config: {
    name: "help",
    version: "1.27",
    author: "NX (💋 Fancy Edition by ChatGPT)",
    usePrefix: false,
    countDown: 5,
    role: 0,
    shortDescription: { en: "View commands list" },
    longDescription: { en: "View commands list" },
    category: "info",
    guide: { en: "{pn} [commandName]" }
  },

  onStart: async function (params) {
    var message = params.message;
    var args = params.args;
    var event = params.event;
    var prefix = await getPrefix(event.threadID);

    // যদি specific command mention করা হয়
    if (args.length > 0) {
      var cmdName = args[0].toLowerCase();
      var cmd = commands.get(cmdName) || commands.get(aliases.get(cmdName));

      if (!cmd) return message.reply(wrap('❌ Command "' + cmdName + '" পাওয়া যায়নি'));

      var guide = (cmd.config.guide && cmd.config.guide.en) || "কোনো guide নেই";

      return message.reply(
        wrap('📌 Command: ' + cmd.config.name) + '\n' +
        '📂 Category: ' + (cmd.config.category || "unknown") + '\n' +
        wrap('📝 Description: ' + (cmd.config.shortDescription ? cmd.config.shortDescription.en : "N/A")) + '\n' +
        wrap('👨‍💻 Author: ' + cmd.config.author) + '\n' +
        wrap('⌛ Cooldown: ' + (cmd.config.countDown || 3) + 's') + '\n' +
        wrap('🔑 Role required: ' + cmd.config.role) + '\n\n' +
        wrap('💡 Usage: ' + guide.replace(/\{pn\}/g, prefix + cmd.config.name))
      );
    }

    // Category wise command list
    var categories = {};
    commands.forEach(function (cmd, name) {
      var cat = cmd.config.category || "Others";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    });

    var msg = '📚 Available Commands (Prefix: ' + prefix + ')\n\n';
    var i = 0;

    for (var cat in categories) {
      var emoji = boxEmojis[i % boxEmojis.length];
      msg += emoji + ' ╔═════ ' + cat + ' ═════╗ ' + '\n';
      categories[cat].forEach(function(c) {
        msg += ' ' + wrap(randomEmoji() + ' ' + c) + '\n';
      });
      msg += ' ╚═══════════════╝ ' + '\n\n';
      i++;
    }

    msg += wrap('💡 Use: ' + prefix + 'help <commandName> বিস্তারিত জানার জন্য');

    // একবার ektai message pathano hocche
    return message.reply(msg);
  }
};
