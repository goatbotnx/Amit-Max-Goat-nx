const { getTime } = global.utils;

module.exports = {
  config: {
    name: "listbox",
    version: "1.0",
    author: "Mesbah Bb'e",
    countDown: 15,
    role: 2,
    description: {
      en: "Listing the threads where the bot participated."
    },
    category: "owner",
    guide: {
      en: "   {pn}"
    },
  },

  langs: {
    en: {
      hasBanned: "Group with id [%1 | %2] has been banned before:\n» Reason: %3\n» Time: %4",
      banned: "Banned group with id [%1 | %2] using bot.\n» Reason: %3\n» Time: %4"
    }
  },

  onStart: async function ({ api, event, threadsData }) {
    const threadList = await api.getThreadList(999, null, ['INBOX']);
    const activeGroups = threadList.filter(group => group.isSubscribed && group.isGroup);

    const groupDetailsList = await Promise.all(activeGroups.map(async (groupInfo) => {
      const threadInfo = await threadsData.get(groupInfo.threadID);
      return threadInfo ? {
        id: groupInfo.threadID,
        name: groupInfo.threadName || "No Name",
        memberCount: threadInfo.members.length || 0
      } : null;
    }));

    const validGroupDetails = groupDetailsList.filter(group => group !== null);
    validGroupDetails.sort((a, b) => b.memberCount - a.memberCount);

    let message = '';
    const groupIDs = [];

    validGroupDetails.forEach((group, index) => {
      message += `${index + 1}. ${group.name}\n» TID: ${group.id}\n» Member: ${group.memberCount}\n\n`;
      groupIDs.push(group.id);
    });

    api.sendMessage(
      message + 'Reply "out" or "ban" followed by the order number to out or ban that thread!!',
      event.threadID,
      (err, data) => {
        global.GoatBot.onReply.set(data.messageID, {
          commandName: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          groupIDs
        });
      }
    );
  },

  onReply: async function ({ api, event, threadsData, Reply, getLang }) {
    const { author, groupIDs } = Reply;
    if (author !== event.senderID) return;

    const [command, indexStr] = event.body.trim().split(" ");
    const index = parseInt(indexStr) - 1;

    if (isNaN(index) || index < 0 || index >= groupIDs.length) return api.sendMessage("Invalid group number.", event.threadID);

    const selectedGroupID = groupIDs[index];
    const userID = event.senderID;

    switch (command.toLowerCase()) {
      case "ban": {
        const threadData = await threadsData.get(selectedGroupID);
        const name = threadData?.threadName || "Unknown";

        if (threadData?.banned?.status) return api.sendMessage(getLang("hasBanned", selectedGroupID, name, threadData.banned.reason, threadData.banned.date), event.threadID);

        const time = getTime("DD/MM/YYYY HH:mm:ss");
        await threadsData.set(selectedGroupID, {
          banned: {
            status: true,
            reason: "Unknown",
            date: time
          }
        });

        return api.sendMessage(getLang("banned", selectedGroupID, name, "Unknown", time), event.threadID);
      }

      case "out": {
        api.removeUserFromGroup(`${api.getCurrentUserID()}`, selectedGroupID, err => {
          if (err) return api.sendMessage("Unable to leave the group.", event.threadID);
          threadsData.get(selectedGroupID).then(thread => {
            const name = thread?.threadName || "Unknown Group";
            api.sendMessage(`Left the thread with ID: ${selectedGroupID}\n${name}`, event.threadID);
          });
        });
        break;
      }

      case "join": {
        const threadInfo = await api.getThreadInfo(selectedGroupID);
        const participantIDs = threadInfo.participantIDs;

        if (participantIDs.includes(userID)) return api.sendMessage("You are already in this group. If you didn't find it, please check your message requests or spam box.", event.threadID);

        api.addUserToGroup(userID, selectedGroupID, err => {
          api.sendMessage(err ? "I can't add you because your ID does not allow message requests or your account is private. Please add me then try again..." : "You have been added to this group. If you didn't find the message in your inbox, please check your message requests or spam box.", event.threadID);
        });
        break;
      }

      default:
        api.sendMessage("Invalid command.", event.threadID);
        break;
    }
  }
};
