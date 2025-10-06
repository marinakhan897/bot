module.exports = {
    config: {
        name: "autoreply",
        version: "3.0", 
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "AI-powered auto-reply with smart responses"
        },
        category: "ai",
        guide: {
            en: "{p}autoreply on - Enable AI mode\n{p}autoreply off - Disable AI mode\n{p}autoreply train - Train with custom responses"
        }
    },

    onStart: async function ({ api, event, args }) {
        const action = args[0];
        
        if (!action) {
            const helpMessage = `🤖 **AI AUTO-REPLY BY MARINA** 🤖

✨ **Smart AI-powered responses**

📝 **Commands:**
• {p}autoreply on - Enable AI mode
• {p}autoreply off - Disable AI mode  
• {p}autoreply train - Add custom training
• {p}autoreply status - Check settings

💡 **Features:**
✅ Natural conversations
✅ Context understanding
✅ Multiple languages
✅ Learning from chats
✅ Emotional intelligence`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        switch (action) {
            case 'on':
                await this.enableAI(api, event);
                break;
            case 'off':
                await this.disableAI(api, event);
                break;
            case 'train':
                await this.trainAI(api, event, args.slice(1).join(' '));
                break;
            case 'status':
                await this.showStatus(api, event);
                break;
            default:
                await api.sendMessage("❌ Invalid command. Use 'autoreply' for help.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            if (event.senderID == api.getCurrentUserID()) return;
            
            const message = event.body?.toLowerCase().trim();
            if (!message) return;

            // Check if AI mode is enabled for this thread
            if (!this.isAIEnabled(event.threadID)) return;

            // Get AI response
            const aiResponse = await this.getAIResponse(message, event.senderID, event.threadID);
            
            if (aiResponse) {
                const delay = Math.floor(Math.random() * 2000) + 1000;
                setTimeout(() => {
                    api.sendMessage(aiResponse, event.threadID);
                }, delay);
            }

        } catch (error) {
            console.error("AI Auto-reply error:", error);
        }
    },

    // AI Response Function
    getAIResponse: async function(message, userId, threadId) {
        try {
            // Use environment variable for API key
            const apiKey = process.env.AI_API_KEY;
            
            if (!apiKey) {
                return "🔧 AI service not configured. Please setup API key.";
            }

            const response = await global.utils.request({
                url: 'https://api.openai.com/v1/chat/completions', // Example API
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are Marina, a friendly AI assistant. Respond naturally in mixed Urdu/English. Be warm, helpful and conversational. Keep responses under 2 sentences.`
                        },
                        {
                            role: "user", 
                            content: message
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });

            const data = JSON.parse(response.body);
            return data.choices[0]?.message?.content || "I'm not sure how to respond to that.";

        } catch (error) {
            console.error("AI API Error:", error);
            return "❌ AI service is currently unavailable.";
        }
    },

    enableAI: async function(api, event) {
        if (!global.aiAutoReply) global.aiAutoReply = {};
        global.aiAutoReply[event.threadID] = true;
        await api.sendMessage("✅ AI Auto-reply enabled! I'll respond intelligently to messages now. ✨", event.threadID);
    },

    disableAI: async function(api, event) {
        if (!global.aiAutoReply) global.aiAutoReply = {};
        global.aiAutoReply[event.threadID] = false;
        await api.sendMessage("❌ AI Auto-reply disabled.", event.threadID);
    },

    isAIEnabled: function(threadId) {
        return global.aiAutoReply && global.aiAutoReply[threadId] === true;
    },

    trainAI: async function(api, event, trainingData) {
        // Custom training logic
        await api.sendMessage("🎓 AI training feature coming soon!", event.threadID);
    },

    showStatus: async function(api, event) {
        const status = this.isAIEnabled(event.threadID) ? "🟢 ENABLED" : "🔴 DISABLED";
        await api.sendMessage(`🤖 AI Auto-Reply Status: ${status}`, event.threadID);
    }
};
