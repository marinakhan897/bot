module.exports = {
    config: {
        name: "hindi",
        version: "1.0",
        author: "Marina",
        countDown: 2,
        role: 0,
        description: "Quick Hindi/Urdu replies",
        category: "utility"
    },

    // The missing onStart function
    onStart: async function ({ api, event, args }) {
        // This function runs when someone uses the command directly (e.g., !hindi)
        // You can keep it empty or add a help message
        const helpMessage = `🤖 Hindi Auto-Reply is Active!
This bot will automatically respond to common Hindi/Urdu questions.`;
        await api.sendMessage(helpMessage, event.threadID);
    },

    onChat: async function ({ api, event }) {
        const msg = event.body?.toLowerCase();
        if (!msg) return;

        const quickReplies = {
            'kaise ho': '🤗 Main theek hoon! Aap sunao?',
            'kahan se ho': '📍 Sukkur se! 🏠',
            'kya karte ho': '💻 Bot hoon! Help karta hoon!',
            'kaun ho': '🤖 Marina Bot hoon!',
            'kisne banaya': '💻 Marina ne banaya!',
            'marina kahan se hai': '📍 Sukkur se!',
            'marina kya karti hai': '💻 Bot developer hain!'
        };

        for (const [key, response] of Object.entries(quickReplies)) {
            if (msg.includes(key)) {
                api.sendMessage(response, event.threadID);
                break;
            }
        }
    }
};
