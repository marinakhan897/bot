module.exports = {
    config: {
        name: "autoreply",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Auto-reply system for specific keywords"
        },
        category: "utility",
        guide: {
            en: ""
        }
    },

    // ADD THIS MISSING onStart FUNCTION
    onStart: async function ({ api, event, args }) {
        const helpMessage = `🤖 Auto-Reply System is Active

This command automatically responds to specific keywords in the chat.`;
        await api.sendMessage(helpMessage, event.threadID);
    },

    // Your existing onChat function remains here
    onChat: async function ({ api, event }) {
        // ... your existing auto-reply logic
    }
};
