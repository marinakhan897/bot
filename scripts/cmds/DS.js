const fs = require('fs-extra');
const path = require('path');

const mentionConfigFile = path.join(__dirname, '..', 'data', 'mention_responses.json');

module.exports = {
    config: {
        name: "mention",
        version: "1.0",
        author: "Marina",
        countDown: 3,
        role: 0,
        description: {
            en: "Auto-respond when bot is mentioned in groups"
        },
        category: "system",
        guide: {
            en: "Just mention @MarinaBot in any group message"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `@ **MENTION RESPONSE SYSTEM** @

👑 **Marina Bot Mention Features**

💫 **How to use:**
Simply mention @MarinaBot in any group message and I'll respond automatically!

🎯 **Mention Triggers:**
• @MarinaBot
• @Marina
• Bot ka naam lo
• Mention karo
• Hey bot

🔧 **Commands:**
{p}mention responses - Customize responses
{p}mention settings - View settings
{p}mention test - Test mention response

🚀 **Always ready when you call!**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'responses':
                    await this.manageResponses(api, event, args.slice(1));
                    break;
                case 'settings':
                    await this.showSettings(api, event);
                    break;
                case 'test':
                    await this.testMention(api, event);
                    break;
                case 'add':
                    await this.addCustomResponse(api, event, args.slice(1));
                    break;
                default:
                    await api.sendMessage("❌ Invalid command. Use: responses, settings, test, add", event.threadID);
            }
        } catch (error) {
            console.error('Mention System Error:', error);
            await api.sendMessage("❌ Error processing mention request.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        // Prevent self-response
        if (event.senderID == api.getCurrentUserID()) return;
        
        const message = event.body;
        if (!message) return;

        // Check if bot is mentioned
        const isMentioned = await this.checkMention(api, event, message);
        
        if (isMentioned) {
            await this.handleMention(api, event, message);
        }
    },

    checkMention: async function (api, event, message) {
        const botID = api.getCurrentUserID();
        
        // Check for direct mentions
        if (event.mentions && event.mentions[botID]) {
            return true;
        }

        // Check for text mentions
        const mentionPatterns = [
            `@${(await api.getCurrentUserInfo()).name}`,
            '@marina',
            '@marinabot', 
            'marina bot',
            'bot ka naam lo',
            'mention karo',
            'hey bot',
            'hello bot',
            'bot ko bulao',
            'marina mention',
            'marina ko bulao'
        ];

        const lowerMessage = message.toLowerCase();
        return mentionPatterns.some(pattern => lowerMessage.includes(pattern.toLowerCase()));
    },

    handleMention: async function (api, event, message) {
        const config = await this.getConfig();
        const responses = config.responses || this.getDefaultResponses();
        
        // Get random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add user's name for personal touch
        let finalResponse = randomResponse;
        try {
            const userInfo = await api.getUserInfo(event.senderID);
            const userName = userInfo[event.senderID]?.firstName || 'Friend';
            finalResponse = finalResponse.replace(/{name}/g, userName);
        } catch (error) {
            // Continue without name if error
        }

        // Random delay to make it natural (1-3 seconds)
        const delay = Math.floor(Math.random() * 2000) + 1000;
        
        setTimeout(async () => {
            try {
                await api.sendMessage(finalResponse, event.threadID);
            } catch (error) {
                console.error('Mention response failed:', error);
            }
        }, delay);
    },

    manageResponses: async function (api, event, args) {
        const action = args[0];
        
        if (!action) {
            const config = await this.getConfig();
            const responses = config.responses || this.getDefaultResponses();
            
            let responseList = "💬 **CURRENT MENTION RESPONSES** 💬\n\n";
            responses.forEach((response, index) => {
                responseList += `${index + 1}. ${response}\n\n`;
            });
            
            responseList += `💫 Total: ${responses.length} responses\n👑 Use: {p}mention add [response] to add more`;
            
            await api.sendMessage(responseList, event.threadID);
            return;
        }

        if (action === 'add') {
            const newResponse = args.slice(1).join(' ');
            if (!newResponse) {
                return api.sendMessage("❌ Use: {p}mention add [your response text]\nYou can use {name} for user's name", event.threadID);
            }

            const config = await this.getConfig();
            if (!config.responses) config.responses = this.getDefaultResponses();
            
            config.responses.push(newResponse);
            await this.saveConfig(config);
            
            await api.sendMessage(`✅ **NEW RESPONSE ADDED** ✅\n\n"${newResponse}"\n\n💫 I'll use this when mentioned!\n👑 Total responses: ${config.responses.length}`, event.threadID);
        }
    },

    showSettings: async function (api, event) {
        const config = await this.getConfig();
        
        const settings = `⚙️ **MENTION SYSTEM SETTINGS** ⚙️

🔹 Active Responses: ${config.responses?.length || 15}
🔹 Response Delay: 1-3 seconds
🔹 Mention Detection: Smart AI
🔹 Self-Response: Disabled

🎯 **Detection Patterns:**
• Direct @mentions
• "marina bot"
• "bot ka naam lo" 
• "mention karo"
• "hey bot"
• And 10+ more patterns

👑 **Smart Features:**
• Personal name replacement
• Random response selection
• Natural timing
• Anti-spam protection

💫 Marina's Advanced Mention System`;

        await api.sendMessage(settings, event.threadID);
    },

    testMention: async function (api, event) {
        const config = await this.getConfig();
        const responses = config.responses || this.getDefaultResponses();
        const testResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add user's name
        let finalResponse = testResponse;
        try {
            const userInfo = await api.getUserInfo(event.senderID);
            const userName = userInfo[event.senderID]?.firstName || 'Friend';
            finalResponse = finalResponse.replace(/{name}/g, userName);
        } catch (error) {}

        await api.sendMessage(`🧪 **TEST MENTION RESPONSE** 🧪\n\nThis is how I'll respond when mentioned:\n\n"${finalResponse}"\n\n💫 Actual response will have 1-3 second delay`, event.threadID);
    },

    addCustomResponse: async function (api, event, args) {
        const responseText = args.join(' ');
        if (!responseText) {
            return api.sendMessage("❌ Use: {p}mention add [response text]\nExample: {p}mention add Hello {name}! How can I help you today? 👑", event.threadID);
        }

        const config = await this.getConfig();
        if (!config.responses) config.responses = this.getDefaultResponses();
        
        config.responses.push(responseText);
        await this.saveConfig(config);
        
        await api.sendMessage(`✅ **CUSTOM RESPONSE ADDED** ✅\n\n"${responseText}"\n\n💫 I'll use this when someone mentions me!\n👑 Use {name} for user's name`, event.threadID);
    },

    getDefaultResponses: function () {
        return [
            "Yes {name}! 👑 Marina Bot here! How can I assist you today? 💫",
            "Hello {name}! 👋 I'm listening! What do you need? 🚀",
            "Hey {name}! 💝 Marina at your service! How can I help? 🌟",
            "Namaste {name}! 🤗 You called? I'm ready to help! 📱",
            "Assalamualaikum {name}! 🕌 Marina Bot present! How may I assist? 🤲",
            "Hi there {name}! 😊 You mentioned me? I'm here to help! 💻",
            "Hello {name}! 👑 Marina's advanced AI is online! What's up? ⚡",
            "Hey {name}! 🎯 You called for Marina? Ready for action! 🔥",
            "Hi {name}! 🌸 Marina Bot activated! How can I serve you today? 💫",
            "Hello {name}! 👋 Your favorite bot is here! What do you need? 🚀",
            "Hey {name}! 💝 Marina listening! How can I make your day better? 🌟",
            "Namaste {name}! 🤗 You summoned the bot! What's the plan? 📱",
            "Assalamualaikum {name}! 🕌 Marina at your command! How can I help? 🤲",
            "Hi {name}! 😊 Marina Bot reporting for duty! What's the mission? 💻",
            "Hello {name}! 👑 Advanced AI activated! How may I assist? ⚡"
        ];
    },

    getConfig: async function () {
        try {
            return await fs.readJson(mentionConfigFile);
        } catch (error) {
            return {
                responses: this.getDefaultResponses(),
                lastUpdate: new Date().toISOString()
            };
        }
    },

    saveConfig: async function (config) {
        await fs.writeJson(mentionConfigFile, config);
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        
        if (!fs.existsSync(mentionConfigFile)) {
            await this.saveConfig({
                responses: this.getDefaultResponses(),
                lastUpdate: new Date().toISOString()
            });
        }
    }
};
