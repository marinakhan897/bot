module.exports = {
    config: {
        name: "smartreact",
        version: "1.0",
        author: "Marina",
        countDown: 3,
        role: 0,
        description: {
            en: "Smart automatic reactions by Dr. Marin's bot"
        },
        category: "utility"
    },

    onChat: async function ({ api, event }) {
        const message = event.body?.toLowerCase();
        if (!message || !event.messageID) return;

        const smartReacts = {
            // Positive reactions
            'good morning': '🌅',
            'good night': '🌙',
            'thank you': '🙏',
            'thanks': '👍',
            'welcome': '😊',
            'awesome': '🤩',
            'amazing': '🎉',
            'great': '👏',
            'perfect': '💯',
            'wow': '😮',
            
            // Emotions
            'love you': '❤️',
            'love this': '💖',
            'happy': '😄',
            'haha': '😂',
            'lol': '😆',
            'funny': '🤣',
            'sad': '😢',
            'cry': '😭',
            'angry': '😡',
            'omg': '😱',
            
            // Dr. Marin related
            'marin': '👑',
            'doctor': '🏥',
            'developer': '💻',
            'bindas': '💫',
            'sukkur': '📍',
            
            // Greetings
            'hello': '👋',
            'hi ': '🤗',
            'hey': '✌️',
            
            // Questions
            'how are you': '💪',
            'what\'s up': '🚀',
            'help': '❓',
            
            // Time related
            'morning': '☀️',
            'night': '🌃',
            'sleep': '😴',
            'tired': '🥱'
        };

        // Check for matches
        for (const [trigger, emoji] of Object.entries(smartReacts)) {
            if (message.includes(trigger)) {
                const delay = Math.random() * 1500 + 500;
                setTimeout(() => {
                    try {
                        api.setMessageReaction(emoji, event.messageID, () => {}, true);
                    } catch (error) {
                        // Silent fail for reaction errors
                    }
                }, delay);
                break; // Only react to first match
            }
        }
    }
};
