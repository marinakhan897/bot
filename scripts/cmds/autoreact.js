const fs = require('fs-extra');
const path = require('path');

const reactConfigFile = path.join(__dirname, '..', 'data', 'autoreact_config.json');

module.exports = {
    config: {
        name: "autoreact",
        version: "2.0",
        author: "Marina",
        countDown: 5,
        role: 1,
        description: {
            en: "Auto-react to every message with smart contextual reactions"
        },
        category: "utility",
        guide: {
            en: "{p}autoreact on/off\n{p}autoreact settings\n{p}autoreact add [word] [emoji]\n{p}autoreact list"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `⚡ **MARINA AUTO-REACT SYSTEM** ⚡

👑 **Smart reactions for every message!**

🎯 **Commands:**
• {p}autoreact on - Enable auto-reactions
• {p}autoreact off - Disable auto-reactions
• {p}autoreact settings - View current settings
• {p}autoreact add [word] [emoji] - Add custom reaction
• {p}autoreact list - Show all reactions
• {p}autoreact frequency [number] - Set reaction frequency

💡 **Features:**
• Reacts to every message intelligently
• Context-aware emoji selection
• Custom reaction rules
• Smart frequency control
• Marina special reactions

🚀 **Powered by Marina's AI Reaction Engine**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'on':
                    await this.enableAutoReact(api, event);
                    break;
                case 'off':
                    await this.disableAutoReact(api, event);
                    break;
                case 'settings':
                    await this.showSettings(api, event);
                    break;
                case 'add':
                    await this.addCustomReaction(api, event, args.slice(1));
                    break;
                case 'list':
                    await this.showReactionList(api, event);
                    break;
                case 'frequency':
                    await this.setFrequency(api, event, args.slice(1));
                    break;
                default:
                    await api.sendMessage("❌ Invalid command. Use: on, off, settings, add, list, frequency", event.threadID);
            }
        } catch (error) {
            console.error('Auto-react Error:', error);
            await api.sendMessage("❌ Error processing auto-react request.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        // Prevent self-reaction loop
        if (event.senderID == api.getCurrentUserID()) return;
        
        const message = event.body?.toLowerCase();
        if (!message || !event.messageID) return;

        try {
            const config = await this.getConfig();
            
            // Check if auto-react is enabled
            if (!config.enabled) return;
            
            // Check frequency control (don't react to every single message)
            if (Math.random() > config.frequency) return;

            const emoji = await this.getSmartReaction(message, event);
            
            if (emoji) {
                // Random delay to make it natural (1-4 seconds)
                const delay = Math.floor(Math.random() * 3000) + 1000;
                
                setTimeout(async () => {
                    try {
                        await api.setMessageReaction(emoji, event.messageID, () => {}, true);
                    } catch (error) {
                        // Silent fail for reaction errors
                    }
                }, delay);
            }

        } catch (error) {
            // Silent fail for auto-react errors
        }
    },

    getSmartReaction: async function (message, event) {
        const config = await this.getConfig();
        const customReactions = config.customReactions || {};
        
        // First, check custom reactions
        for (const [keyword, emoji] of Object.entries(customReactions)) {
            if (message.includes(keyword.toLowerCase())) {
                return emoji;
            }
        }

        // Smart contextual reactions based on message content
        const smartReactions = {
            // Greetings & Basic
            'hello': '👋', 'hi': '🤗', 'hey': '✌️', 'good morning': '🌅', 'good night': '🌙',
            'assalamualaikum': '🕌', 'salam': '🤲', 'bye': '👋', 'welcome': '😊',
            
            // Emotions - Positive
            'happy': '😄', 'haha': '😂', 'lol': '🤣', 'funny': '😆', 'smile': '😊',
            'joy': '😁', 'excited': '🤩', 'love': '❤️', 'amazing': '🎉', 'great': '👍',
            'good': '👌', 'nice': '💫', 'perfect': '✅', 'awesome': '🔥', 'wow': '😮',
            'beautiful': '🌸', 'cute': '💝', 'sweet': '🍬', 'cool': '😎',
            
            // Emotions - Negative
            'sad': '😢', 'cry': '😭', 'angry': '😠', 'upset': '😤', 'tired': '🥱',
            'sleepy': '😴', 'bored': '😑', 'sick': '🤒', 'hurt': '🤕', 'bad': '👎',
            
            // Islamic & Religious
            'allah': '🤲', 'masha allah': '🌟', 'subhanallah': '💫', 'alhamdulillah': '🙏',
            'allah hu akbar': '⚡', 'islam': '🕌', 'quran': '📖', 'prayer': '🕋',
            'ramadan': '🌙', 'eid': '🎉', 'prophet': '🌹', 'masjid': '🕍',
            
            // Marina & Tech
            'marina': '👑', 'developer': '💻', 'coding': '👩‍💻', 'programming': '⌨️',
            'bot': '🤖', 'command': '⚡', 'update': '🔄', 'feature': '🎯',
            
            // Questions & Thinking
            'what': '🤔', 'why': '🧐', 'how': '🤷', 'when': '⏰', 'where': '📍',
            'who': '👤', 'question': '❓', 'think': '💭', 'idea': '💡',
            
            // Food & Drinks
            'food': '🍕', 'eat': '🍽️', 'hungry': '🍔', 'pizza': '🍕', 'burger': '🍔',
            'ice cream': '🍦', 'coffee': '☕', 'tea': '🫖', 'water': '💧', 'juice': '🧃',
            
            // Time & Weather
            'morning': '☀️', 'afternoon': '🌤️', 'evening': '🌆', 'night': '🌃',
            'today': '📅', 'tomorrow': '⏭️', 'yesterday': '⏮️', 'now': '⏱️',
            'hot': '🔥', 'cold': '❄️', 'rain': '🌧️', 'sun': '☀️', 'weather': '🌤️',
            
            // Activities
            'game': '🎮', 'play': '🕹️', 'work': '💼', 'study': '📚', 'read': '📖',
            'write': '✍️', 'draw': '🎨', 'sing': '🎤', 'dance': '💃', 'music': '🎵',
            
            // Technology
            'phone': '📱', 'computer': '💻', 'internet': '🌐', 'wifi': '📶',
            'camera': '📷', 'video': '🎥', 'photo': '🖼️', 'app': '📲',
            
            // Celebrations
            'birthday': '🎂', 'congratulations': '🎉', 'party': '🥳', 'celebration': '🎊',
            'winner': '🏆', 'champion': '🥇', 'success': '✅', 'achievement': '⭐',
            
            // Random & Fun
            'cat': '🐱', 'dog': '🐶', 'heart': '❤️', 'star': '⭐', 'fire': '🔥',
            'money': '💰', 'gift': '🎁', 'ball': '⚽', 'car': '🚗', 'plane': '✈️'
        };

        // Find the best matching reaction
        const words = message.split(' ');
        for (const word of words) {
            if (word.length > 2 && smartReactions[word]) {
                return smartReactions[word];
            }
        }

        // Check for phrase matches
        for (const [phrase, emoji] of Object.entries(smartReactions)) {
            if (phrase.length > 3 && message.includes(phrase)) {
                return emoji;
            }
        }

        // Default random reactions based on message length
        const defaultReactions = ['👍', '❤️', '😊', '😂', '😮', '😢', '😠', '🎉'];
        return defaultReactions[Math.floor(Math.random() * defaultReactions.length)];
    },

    enableAutoReact: async function (api, event) {
        const config = await this.getConfig();
        config.enabled = true;
        await this.saveConfig(config);
        
        await api.sendMessage(`✅ **AUTO-REACT ENABLED** ✅\n\n⚡ Marina will now react to messages automatically!\n\n💫 Features activated:\n• Smart contextual reactions\n• Custom reaction rules\n• Frequency control\n• Marina special reactions\n\n👑 Powered by Marina's AI Engine`, event.threadID);
    },

    disableAutoReact: async function (api, event) {
        const config = await this.getConfig();
        config.enabled = false;
        await this.saveConfig(config);
        
        await api.sendMessage(`❌ **AUTO-REACT DISABLED** ❌\n\nMarina will stop reacting to messages automatically.\n\nUse {p}autoreact on to enable again.`, event.threadID);
    },

    showSettings: async function (api, event) {
        const config = await this.getConfig();
        
        const settings = `⚙️ **AUTO-REACT SETTINGS** ⚙️

🔹 Status: ${config.enabled ? '🟢 ENABLED' : '🔴 DISABLED'}
🔹 Frequency: ${Math.round(config.frequency * 100)}% of messages
🔹 Custom Reactions: ${Object.keys(config.customReactions || {}).length}
🔹 Smart Reactions: 150+ contextual emojis

🎯 **Reaction Types:**
• Greetings & Emotions
• Islamic & Religious
• Marina & Technology
• Food & Activities
• Questions & Thinking
• Celebrations & Fun

👑 Marina's Smart Reaction System`;

        await api.sendMessage(settings, event.threadID);
    },

    addCustomReaction: async function (api, event, args) {
        const keyword = args[0];
        const emoji = args[1];
        
        if (!keyword || !emoji) {
            return api.sendMessage("❌ Use: autoreact add [keyword] [emoji]\nExample: autoreact add marina 👑", event.threadID);
        }

        const config = await this.getConfig();
        if (!config.customReactions) {
            config.customReactions = {};
        }

        config.customReactions[keyword.toLowerCase()] = emoji;
        await this.saveConfig(config);
        
        await api.sendMessage(`✅ **CUSTOM REACTION ADDED** ✅\n\nKeyword: "${keyword}"\nReaction: ${emoji}\n\nMarina will now react with ${emoji} when someone says "${keyword}"!`, event.threadID);
    },

    showReactionList: async function (api, event) {
        const config = await this.getConfig();
        const customReactions = config.customReactions || {};
        
        if (Object.keys(customReactions).length === 0) {
            return api.sendMessage("📝 No custom reactions added yet.\nUse {p}autoreact add [word] [emoji] to create one!", event.threadID);
        }

        let list = "📋 **CUSTOM REACTIONS** 📋\n\n";
        Object.entries(customReactions).forEach(([keyword, emoji], index) => {
            list += `${index + 1}. "${keyword}" → ${emoji}\n`;
        });

        list += `\n💫 Total: ${Object.keys(customReactions).length} custom reactions\n👑 Managed by Marina`;

        await api.sendMessage(list, event.threadID);
    },

    setFrequency: async function (api, event, args) {
        const frequency = parseFloat(args[0]);
        
        if (isNaN(frequency) || frequency < 0.1 || frequency > 1) {
            return api.sendMessage("❌ Please provide a frequency between 0.1 and 1.0\nExample: autoreact frequency 0.7 (reacts to 70% of messages)", event.threadID);
        }

        const config = await this.getConfig();
        config.frequency = frequency;
        await this.saveConfig(config);
        
        await api.sendMessage(`✅ **FREQUENCY UPDATED** ✅\n\nMarina will now react to ${Math.round(frequency * 100)}% of messages!\n\nCurrent setting: ${frequency}`, event.threadID);
    },

    // Configuration management
    getConfig: async function () {
        try {
            const config = await fs.readJson(reactConfigFile);
            return {
                enabled: config.enabled !== undefined ? config.enabled : false,
                frequency: config.frequency || 0.6, // 60% of messages
                customReactions: config.customReactions || {}
            };
        } catch (error) {
            return {
                enabled: false,
                frequency: 0.6,
                customReactions: {}
            };
        }
    },

    saveConfig: async function (config) {
        await fs.writeJson(reactConfigFile, config);
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        
        if (!fs.existsSync(reactConfigFile)) {
            await this.saveConfig({
                enabled: false,
                frequency: 0.6,
                customReactions: {}
            });
        }
    }
};
