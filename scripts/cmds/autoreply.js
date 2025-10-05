module.exports = {
    config: {
        name: "autoreact",
        version: "1.0.0", 
        author: "Marina",
        countDown: 5,
        role: 2,
        description: {
            en: "Automatically react to messages with specific content"
        },
        category: "owner",
        guide: {
            en: "{p}autoreact [add/remove/list] [trigger] [emoji]"
        }
    },

    onChat: async function ({ api, event }) {
        const message = event.body?.toLowerCase() || "";
        const autoReactions = await getAutoReactions();
        
        for (const rule of autoReactions) {
            if (message.includes(rule.trigger.toLowerCase())) {
                api.setMessageReaction(rule.emoji, event.messageID, () => {}, true);
                break;
            }
        }
    }
};
