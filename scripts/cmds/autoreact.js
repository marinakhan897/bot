
module.exports = {
    config: {
        name: "autoreact",
        version: "1.0.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Automatically react to messages with specific content"
        },
        category: "utility",
        guide: {
            en: ""
        }
    },

    onStart: async function ({ api, args, event, usersData, threadsData }) {
        // Your command code for when the command is called directly
        // For example: !autoreact
        api.sendMessage("Auto-react feature is running.", event.threadID);
    },

    onChat: async function ({ api, event }) {
        // Your code for automatic triggering on all messages
        const message = event.body?.toLowerCase();

        const reactionRules = {
            'hello': '👋',
            'good night': '🌙',
            'marin': '👑'
        };

        for (const [keyword, emoji] of Object.entries(reactionRules)) {
            if (message?.includes(keyword)) {
                api.setMessageReaction(emoji, event.messageID, (err) => {}, true);
                break;
            }
        }
    }
};
