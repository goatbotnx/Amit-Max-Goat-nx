module.exports = {
    config: {
        name: "money",
        aliases: ["balmod"],
        version: "1.0",
        author: "NTKhang",
        countDown: 5,
        role: 1, // Admin/moderator only
        description: {
            en: "Set, add, or remove money for a user"
        },
        category: "economy",
        guide: {
            en: "{pn} <set|add|remove> <@tag> <amount>"
        }
    },

    langs: {
        en: {
            noTag: "Please tag a user",
            invalidAmount: "Invalid amount",
            setSuccess: "Set %1$ for %2 successfully",
            addSuccess: "Added %1$ to %2 successfully",
            removeSuccess: "Removed %1$ from %2 successfully"
        }
    },

    onStart: async function({ message, event, usersData, getLang, args }) {
        if (!event.mentions || Object.keys(event.mentions).length === 0) 
            return message.reply(getLang("noTag"));

        const action = args[0]?.toLowerCase();
        const amount = parseInt(args[2]);
        if (!["set", "add", "remove"].includes(action)) 
            return message.reply("Invalid action! Use set, add or remove.");
        if (isNaN(amount) || amount < 0) 
            return message.reply(getLang("invalidAmount"));

        const uid = Object.keys(event.mentions)[0];

        let currentMoney = await usersData.get(uid, "money") || 0;

        if (action === "set") await usersData.set(uid, amount, "money");
        else if (action === "add") await usersData.set(uid, currentMoney + amount, "money");
        else if (action === "remove") await usersData.set(uid, Math.max(0, currentMoney - amount), "money");

        const langKey = action + "Success";
        return message.reply(getLang(langKey, amount, event.mentions[uid].replace("@", "")));
    }
};
