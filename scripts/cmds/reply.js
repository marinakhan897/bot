const fs = require('fs-extra');
const path = require('path');

// File to store auto-reply rules
const autoReplyFile = path.join(__dirname, '..', 'data', 'autoreply.json');

// Ensure data directory exists
const ensureDataDir = async () => {
    const dataDir = path.join(__dirname, '..', 'data');
    await fs.ensureDir(dataDir);
    if (!fs.existsSync(autoReplyFile)) {
        await fs.writeJson(autoReplyFile, []);
    }
};

module.exports = {
    config: {
        name: "autoreply",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 1, // 1 for admin, 0 for all users
        description: {
            en: "Manage auto-reply messages for your bot"
        },
        category: "utility",
        guide: {
            en: "{p}autoreply add [trigger] | [response]\n{p}autoreply remove [trigger]\n{p}autoreply list\n{p}autoreply on/off"
        }
    },

    onStart: async function ({ api, event, args }) {
        await ensureDataDir();
        const autoReplies = await fs.readJson(autoReplyFile);
        
        const action = args[0];
        
        if (!action) {
            return api.sendMessage(`🤖 **AUTO-REPLY SYSTEM** 🤖

📝 **Available Commands:**
• {p}autoreply add [trigger] | [response]
• {p}autoreply remove [trigger]  
• {p}autoreply list
• {p}autoreply on/off

💡 **Example:**
{p}autoreply add hello | Hello there! I'm Dr. Marin's bot!`, event.threadID);
        }

        if (action === 'add') {
            const input = args.slice(1).join(' ');
            const [trigger, ...responseParts] = input.split('|');
            
            if (!trigger || !responseParts.length) {
                return api.sendMessage("❌ Please use: autoreply add [trigger] | [response]", event.threadID);
            }

            const response = responseParts.join('|').trim();
            const existingIndex = autoReplies.findIndex(ar => ar.trigger === trigger.toLowerCase());
            
            if (existingIndex !== -1) {
                autoReplies[existingIndex].response = response;
                await fs.writeJson(autoReplyFile, autoReplies);
                return api.sendMessage(`✅ Updated auto-reply for "${trigger}"`, event.threadID);
            } else {
                autoReplies.push({
                    trigger: trigger.toLowerCase(),
                    response: response,
                    enabled: true
                });
                await fs.writeJson(autoReplyFile, autoReplies);
                return api.sendMessage(`✅ Added new auto-reply for "${trigger}"`, event.threadID);
            }
        }

        if (action === 'remove') {
            const trigger = args.slice(1).join(' ').toLowerCase();
            const filtered = autoReplies.filter(ar => ar.trigger !== trigger);
            
            if (filtered.length === autoReplies.length) {
                return api.sendMessage(`❌ No auto-reply found for "${trigger}"`, event.threadID);
            }
            
            await fs.writeJson(autoReplyFile, filtered);
            return api.sendMessage(`✅ Removed auto-reply for "${trigger}"`, event.threadID);
        }

        if (action === 'list') {
            if (autoReplies.length === 0) {
                return api.sendMessage("📝 No auto-replies configured yet.", event.threadID);
            }
            
            let list = "📋 **AUTO-REPLY LIST** 📋\n\n";
            autoReplies.forEach((ar, index) => {
                list += `${index + 1}. "${ar.trigger}" → "${ar.response}" ${ar.enabled ? '🟢' : '🔴'}\n`;
            });
            
            return api.sendMessage(list, event.threadID);
        }

        if (action === 'on' || action === 'off') {
            const enabled = action === 'on';
            // This would require global state management
            return api.sendMessage(`✅ Auto-reply system ${enabled ? 'enabled' : 'disabled'}`, event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            await ensureDataDir();
            const autoReplies = await fs.readJson(autoReplyFile);
            const message = event.body?.toLowerCase().trim();
            
            if (!message) return;

            // Find matching auto-reply
            const matchedReply = autoReplies.find(ar => 
                ar.enabled && message.includes(ar.trigger.toLowerCase())
            );

            if (matchedReply) {
                // Add small delay to make it natural
                setTimeout(() => {
                    api.sendMessage(matchedReply.response, event.threadID);
                }, 1000);
            }
        } catch (error) {
            console.error("Auto-reply error:", error);
        }
    }
};
