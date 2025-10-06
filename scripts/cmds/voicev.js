module.exports = {
    config: {
        name: "voicev",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Convert text to voice messages"
        },
        category: "media",
        guide: {
            en: "{p}voice [text] - Convert text to voice\n{p}voice lang list - Show languages\n{p}voice speed [1-3] - Set speed"
        }
    },

    onStart: async function ({ api, event, args }) {
        if (args.length === 0) {
            const helpMessage = `🎵 **VOICE COMMAND** 🎵

📢 **Convert text to voice messages**

📝 **Usage:**
• {p}voice [text] - Convert text to voice
• {p}voice lang list - Available languages
• {p}voice speed [1-3] - Set speed (1=slow, 3=fast)

🌐 **Examples:**
{p}voice Hello how are you?
{p}voice lang list
{p}voice speed 2`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        // Command logic here
        await api.sendMessage("Voice feature implementation...", event.threadID);
    }
};
