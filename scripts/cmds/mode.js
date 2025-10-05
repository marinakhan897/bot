const fs = require('fs-extra');
const path = require('path');

const modeConfigFile = path.join(__dirname, '..', 'data', 'bot_modes.json');

module.exports = {
    config: {
        name: "mode",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 1,
        description: {
            en: "Manage bot operational modes and settings"
        },
        category: "system",
        guide: {
            en: "{p}mode [mode_name]\n{p}mode list\n{p}mode settings\n{p}mode custom [name] [settings]"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `🎛️ **MARINA BOT MODE SYSTEM** 🎛️

👑 **Advanced Operational Modes**

🎯 **Available Modes:**
• islamic - Islamic-focused mode
• fun - Entertainment mode
• work - Professional/work mode
• silent - Quiet mode
• social - Social media mode
• admin - Admin control mode
• marina - Marina special mode
• custom - Custom configurations

💡 **Commands:**
{p}mode islamic - Switch to Islamic mode
{p}mode fun - Switch to Fun mode
{p}mode list - Show all modes
{p}mode settings - Current mode settings
{p}mode custom [name] - Create custom mode

🚀 **Transform your bot's behavior instantly!**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'list':
                    await this.showAllModes(api, event);
                    break;
                case 'settings':
                    await this.showCurrentSettings(api, event);
                    break;
                case 'custom':
                    await this.createCustomMode(api, event, args.slice(1));
                    break;
                case 'reset':
                    await this.resetToDefault(api, event);
                    break;
                default:
                    await this.switchMode(api, event, action);
            }
        } catch (error) {
            console.error('Mode System Error:', error);
            await api.sendMessage("❌ Error processing mode request.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        // Mode-specific behavior based on current mode
        const currentMode = await this.getCurrentMode();
        await this.applyModeBehavior(api, event, currentMode);
    },

    switchMode: async function (api, event, modeName) {
        const availableModes = await this.getAvailableModes();
        const mode = availableModes[modeName];

        if (!mode) {
            return api.sendMessage(`❌ Mode "${modeName}" not found. Use {p}mode list to see available modes.`, event.threadID);
        }

        const config = await this.getConfig();
        config.currentMode = modeName;
        config.lastSwitch = new Date().toISOString();
        await this.saveConfig(config);

        const modeMessage = this.getModeActivationMessage(modeName);
        await api.sendMessage(modeMessage, event.threadID);

        // Apply mode-specific immediate changes
        await this.applyImmediateModeChanges(api, event, modeName);
    },

    showAllModes: async function (api, event) {
        const availableModes = await this.getAvailableModes();
        
        let modesList = `📋 **AVAILABLE BOT MODES** 📋\n\n`;
        
        Object.entries(availableModes).forEach(([modeName, modeConfig]) => {
            modesList += `🔸 **${modeName.toUpperCase()} MODE**\n`;
            modesList += `   📝 ${modeConfig.description}\n`;
            modesList += `   ⚡ Features: ${modeConfig.features.join(', ')}\n`;
            modesList += `   💫 Use: {p}mode ${modeName}\n\n`;
        });

        modesList += `👑 Total: ${Object.keys(availableModes).length} modes available\n💡 Use {p}mode [name] to switch modes`;

        await api.sendMessage(modesList, event.threadID);
    },

    showCurrentSettings: async function (api, event) {
        const config = await this.getConfig();
        const currentMode = config.currentMode || 'default';
        const availableModes = await this.getAvailableModes();
        const modeConfig = availableModes[currentMode];

        let settings = `⚙️ **CURRENT MODE SETTINGS** ⚙️\n\n`;
        settings += `🔹 Current Mode: **${currentMode.toUpperCase()}**\n`;
        settings += `🔹 Description: ${modeConfig.description}\n`;
        settings += `🔹 Last Switch: ${config.lastSwitch ? new Date(config.lastSwitch).toLocaleString() : 'Never'}\n\n`;

        settings += `🎯 **ACTIVE FEATURES:**\n`;
        modeConfig.features.forEach((feature, index) => {
            settings += `${index + 1}. ${feature}\n`;
        });

        settings += `\n🔧 **SETTINGS:**\n`;
        Object.entries(modeConfig.settings).forEach(([key, value]) => {
            settings += `• ${key}: ${value}\n`;
        });

        settings += `\n👑 Managed by Marina's Mode System`;

        await api.sendMessage(settings, event.threadID);
    },

    createCustomMode: async function (api, event, args) {
        const modeName = args[0];
        if (!modeName) {
            return api.sendMessage("❌ Use: {p}mode custom [mode_name] [settings]\nExample: {p}mode custom gaming auto_reply:off games:on", event.threadID);
        }

        const customSettings = {};
        for (let i = 1; i < args.length; i++) {
            const [key, value] = args[i].split(':');
            if (key && value) {
                customSettings[key] = value;
            }
        }

        const customMode = {
            name: modeName,
            description: "Custom user-created mode",
            features: ['Custom configuration', 'User settings'],
            settings: {
                auto_reply: customSettings.auto_reply || 'on',
                reactions: customSettings.reactions || 'on',
                islamic_content: customSettings.islamic_content || 'off',
                fun_commands: customSettings.fun_commands || 'on',
                ...customSettings
            }
        };

        const config = await this.getConfig();
        if (!config.customModes) config.customModes = {};
        config.customModes[modeName] = customMode;
        await this.saveConfig(config);

        await api.sendMessage(`✅ **CUSTOM MODE CREATED** ✅\n\nMode: ${modeName}\nSettings: ${JSON.stringify(customSettings)}\n\nUse: {p}mode ${modeName} to activate your custom mode!`, event.threadID);
    },

    resetToDefault: async function (api, event) {
        const config = await this.getConfig();
        config.currentMode = 'default';
        config.lastSwitch = new Date().toISOString();
        await this.saveConfig(config);

        await api.sendMessage(`🔄 **MODE RESET TO DEFAULT** 🔄\n\nAll mode settings have been reset to default configuration.\n\n👑 Marina's Bot is now in standard operational mode.`, event.threadID);
    },

    applyModeBehavior: async function (api, event, modeName) {
        if (event.senderID == api.getCurrentUserID()) return;
        
        const modeConfig = await this.getAvailableModes();
        const mode = modeConfig[modeName] || modeConfig.default;
        
        // Apply mode-specific behaviors
        switch (modeName) {
            case 'islamic':
                await this.applyIslamicMode(api, event);
                break;
            case 'fun':
                await this.applyFunMode(api, event);
                break;
            case 'silent':
                // Minimal responses
                break;
            case 'social':
                await this.applySocialMode(api, event);
                break;
            case 'marina':
                await this.applyMarinaMode(api, event);
                break;
            default:
                // Default behavior
                break;
        }
    },

    applyIslamicMode: async function (api, event) {
        const message = event.body?.toLowerCase();
        if (!message) return;

        const islamicResponses = {
            'hello': 'Assalamualaikum! 👋',
            'hi': 'Wa Alaikum Assalam! 🤲',
            'how are you': 'Alhamdulillah, I am good! How about you? 💫',
            'thank you': 'JazakAllah Khair! 🙏',
            'allah': 'Subhanallah! Allah is the Greatest! 🌟',
            'islam': 'Islam is the complete way of life! 🕌'
        };

        for (const [trigger, response] of Object.entries(islamicResponses)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 1000);
                break;
            }
        }
    },

    applyFunMode: async function (api, event) {
        const message = event.body?.toLowerCase();
        if (!message) return;

        const funResponses = {
            'hello': 'Hey there! Ready for some fun? 🎉',
            'joke': 'Why did the bot go to school? To improve its algorithm! 🤣',
            'game': 'Let\'s play! Use {p}game to see available games! 🎮',
            'fun': 'Fun mode activated! Everything is more entertaining now! 😄'
        };

        for (const [trigger, response] of Object.entries(funResponses)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 1000);
                break;
            }
        }

        // Auto-reactions in fun mode
        if (Math.random() > 0.7) {
            const funEmojis = ['😂', '🎉', '🤣', '😄', '🎊', '🥳'];
            const randomEmoji = funEmojis[Math.floor(Math.random() * funEmojis.length)];
            setTimeout(() => {
                try {
                    api.setMessageReaction(randomEmoji, event.messageID, () => {}, true);
                } catch (error) {}
            }, 1500);
        }
    },

    applySocialMode: async function (api, event) {
        // Social media style responses
        const message = event.body?.toLowerCase();
        if (!message) return;

        const socialResponses = {
            'post': 'Ready to create an amazing post! Use {p}fbpost 📱',
            'share': 'Sharing is caring! 🔄',
            'like': 'Liked! 👍',
            'comment': 'Great comment! 💬'
        };

        for (const [trigger, response] of Object.entries(socialResponses)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 1000);
                break;
            }
        }
    },

    applyMarinaMode: async function (api, event) {
        const message = event.body?.toLowerCase();
        if (!message) return;

        const marinaResponses = {
            'hello': 'Marina\'s bot at your service! 👑',
            'help': 'Marina is here to help! Use {p}help for commands 💻',
            'marina': 'That\'s me! Your favorite developer! 💝',
            'developer': 'Marina codes with passion and precision! 🔧'
        };

        for (const [trigger, response] of Object.entries(marinaResponses)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 1000);
                break;
            }
        }
    },

    applyImmediateModeChanges: async function (api, event, modeName) {
        // Apply immediate changes when mode switches
        switch (modeName) {
            case 'silent':
                await api.sendMessage("🔇 Silent mode activated. Minimal responses enabled.", event.threadID);
                break;
            case 'work':
                await api.sendMessage("💼 Work mode activated. Professional responses enabled.", event.threadID);
                break;
            case 'admin':
                await api.sendMessage("👮 Admin mode activated. Full control enabled.", event.threadID);
                break;
        }
    },

    getModeActivationMessage: function (modeName) {
        const activationMessages = {
            'islamic': `🕌 **ISLAMIC MODE ACTIVATED** 🕌\n\nNow featuring:\n• Islamic greetings\n• Quran reminders\n• Islamic knowledge\n• Prayer times\n• Halal content only\n\n🤲 May Allah bless your conversations!`,
            
            'fun': `🎉 **FUN MODE ACTIVATED** 🎉\n\nNow featuring:\n• Games and entertainment\n• Jokes and humor\n• Fun responses\n• Interactive features\n• Entertainment commands\n\n😄 Get ready for some fun!`,
            
            'work': `💼 **WORK MODE ACTIVATED** 💼\n\nNow featuring:\n• Professional responses\n• Productivity tools\n• Business commands\n• Formal language\n• Work utilities\n\n🚀 Boost your productivity!`,
            
            'silent': `🔇 **SILENT MODE ACTIVATED** 🔇\n\nNow featuring:\n• Minimal responses\n• Quiet operation\n• Essential commands only\n• No auto-replies\n• Stealth mode\n\n🤫 Operating quietly...`,
            
            'social': `📱 **SOCIAL MODE ACTIVATED** 📱\n\nNow featuring:\n• Social media commands\n• Post creation\n• Sharing features\n• Engagement tools\n• Trend following\n\n🌟 Be social!`,
            
            'admin': `👮 **ADMIN MODE ACTIVATED** 👮\n\nNow featuring:\n• Full admin controls\n• System management\n• User management\n• Security features\n• Advanced commands\n\n🔧 Full control enabled!`,
            
            'marina': `👑 **MARINA MODE ACTIVATED** 👑\n\nNow featuring:\n• Marina special commands\n• Developer features\n• Tech insights\n• Coding utilities\n• Marina branding\n\n💻 Powered by Marina!`,
            
            'default': `⚡ **DEFAULT MODE ACTIVATED** ⚡\n\nStandard features enabled:\n• Balanced responses\n• All basic commands\n• Mixed content\n• Normal operation\n\n🤖 Operating normally!`
        };

        return activationMessages[modeName] || activationMessages.default;
    },

    getAvailableModes: function () {
        return {
            'default': {
                description: "Standard balanced mode with all features",
                features: ['Auto-reply', 'Reactions', 'Islamic content', 'Fun commands', 'Utility tools'],
                settings: {
                    auto_reply: 'on',
                    reactions: 'on',
                    islamic_content: 'balanced',
                    fun_commands: 'on'
                }
            },
            'islamic': {
                description: "Islamic-focused mode with religious content",
                features: ['Islamic greetings', 'Quran verses', 'Prayer reminders', 'Halal content', 'Islamic knowledge'],
                settings: {
                    auto_reply: 'islamic_only',
                    reactions: 'islamic_emojis',
                    islamic_content: 'priority',
                    fun_commands: 'limited'
                }
            },
            'fun': {
                description: "Entertainment and fun-focused mode",
                features: ['Games', 'Jokes', 'Entertainment', 'Fun responses', 'Interactive features'],
                settings: {
                    auto_reply: 'fun_responses',
                    reactions: 'fun_emojis',
                    islamic_content: 'off',
                    fun_commands: 'priority'
                }
            },
            'work': {
                description: "Professional and work-oriented mode",
                features: ['Productivity tools', 'Business commands', 'Formal language', 'Work utilities', 'Professional responses'],
                settings: {
                    auto_reply: 'professional',
                    reactions: 'minimal',
                    islamic_content: 'off',
                    fun_commands: 'off'
                }
            },
            'silent': {
                description: "Quiet mode with minimal interactions",
                features: ['Essential commands only', 'Minimal responses', 'Quiet operation', 'Stealth mode'],
                settings: {
                    auto_reply: 'off',
                    reactions: 'off',
                    islamic_content: 'off',
                    fun_commands: 'off'
                }
            },
            'social': {
                description: "Social media and engagement mode",
                features: ['Post creation', 'Sharing tools', 'Social commands', 'Engagement features', 'Trend following'],
                settings: {
                    auto_reply: 'social_responses',
                    reactions: 'social_emojis',
                    islamic_content: 'off',
                    fun_commands: 'social_only'
                }
            },
            'admin': {
                description: "Administrative control mode",
                features: ['System management', 'User controls', 'Security features', 'Advanced commands', 'Full access'],
                settings: {
                    auto_reply: 'admin_only',
                    reactions: 'off',
                    islamic_content: 'off',
                    fun_commands: 'off'
                }
            },
            'marina': {
                description: "Marina special developer mode",
                features: ['Marina commands', 'Developer tools', 'Tech insights', 'Coding utilities', 'Marina branding'],
                settings: {
                    auto_reply: 'marina_responses',
                    reactions: 'marina_emojis',
                    islamic_content: 'off',
                    fun_commands: 'marina_fun'
                }
            }
        };
    },

    getCurrentMode: async function () {
        const config = await this.getConfig();
        return config.currentMode || 'default';
    },

    getConfig: async function () {
        try {
            return await fs.readJson(modeConfigFile);
        } catch (error) {
            return {
                currentMode: 'default',
                lastSwitch: new Date().toISOString(),
                customModes: {}
            };
        }
    },

    saveConfig: async function (config) {
        await fs.writeJson(modeConfigFile, config);
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        
        if (!fs.existsSync(modeConfigFile)) {
            await this.saveConfig({
                currentMode: 'default',
                lastSwitch: new Date().toISOString(),
                customModes: {}
            });
        }
    }
};
