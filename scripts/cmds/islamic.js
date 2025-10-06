module.exports = {
    config: {
        name: "islamicreply",
        version: "1.0.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: "Islamic auto-reply system with Quranic verses, duas, and Islamic knowledge",
        category: "islamic",
        guide: {
            en: "{p}islamicreply add [keyword] | [reply]\n{p}islamicreply remove [keyword]\n{p}islamicreply list\n{p}islamicreply on\n{p}islamicreply off"
        }
    },

    onStart: async function ({ api, event, args }) {
        const action = args[0];
        
        if (!action) {
            const helpMessage = `🕌 **ISLAMIC AUTO-REPLY SYSTEM** 🕌

📖 **Features:**
• Quranic Verses & Hadith
• Islamic Duas & Azkar
• Islamic Knowledge
• Daily Reminders
• Auto-response to Islamic queries

🕋 **Commands:**
• {p}islamicreply add [keyword] | [reply]
• {p}islamicreply remove [keyword]
• {p}islamicreply list
• {p}islamicreply on - Enable auto-reply
• {p}islamicreply off - Disable auto-reply

📝 **Examples:**
{p}islamicreply add allah | Allah is the Greatest, Alhamdulillah 🤲
{p}islamicreply add subhanallah | SubhanAllah, Glory be to Allah 🌟`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        switch (action) {
            case 'add':
                await this.addKeyword(api, event, args.slice(1).join(' '));
                break;
            case 'remove':
                await this.removeKeyword(api, event, args.slice(1).join(' '));
                break;
            case 'list':
                await this.listKeywords(api, event);
                break;
            case 'on':
                await this.toggleAutoReply(api, event, true);
                break;
            case 'off':
                await this.toggleAutoReply(api, event, false);
                break;
            default:
                await api.sendMessage("❌ Invalid command. Use 'islamicreply' for help.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            if (event.senderID === api.getCurrentUserID()) return;
            
            if (!this.isAutoReplyEnabled()) return;
            
            const message = event.body?.toLowerCase().trim();
            if (!message) return;

            const islamicReplies = this.getIslamicReplies();
            const matchedReply = this.findBestMatch(message, islamicReplies);
            
            if (matchedReply) {
                const delay = Math.floor(Math.random() * 2000) + 1000;
                setTimeout(async () => {
                    try {
                        await api.sendMessage(matchedReply, event.threadID);
                    } catch (error) {
                        console.error("Send message error:", error);
                    }
                }, delay);
            }

        } catch (error) {
            console.error("Islamic auto-reply error:", error);
        }
    },

    getIslamicReplies: function () {
        if (!global.islamicReplyData) {
            global.islamicReplyData = this.initializeIslamicReplies();
        }
        return global.islamicReplyData;
    },

    saveIslamicReplies: function (data) {
        global.islamicReplyData = data;
    },

    isAutoReplyEnabled: function () {
        if (typeof global.islamicAutoReplyEnabled === 'undefined') {
            global.islamicAutoReplyEnabled = true;
        }
        return global.islamicAutoReplyEnabled;
    },

    toggleAutoReply: async function (api, event, status) {
        global.islamicAutoReplyEnabled = status;
        await api.sendMessage(
            `✅ Islamic auto-reply ${status ? 'enabled' : 'disabled'}!`,
            event.threadID
        );
    },

    addKeyword: async function (api, event, input) {
        const parts = input.split('|').map(part => part.trim());
        if (parts.length !== 2) {
            return api.sendMessage("❌ Format: islamicreply add [keyword] | [reply]", event.threadID);
        }

        const [keyword, reply] = parts;
        const islamicReplies = this.getIslamicReplies();
        islamicReplies[keyword.toLowerCase()] = reply;
        this.saveIslamicReplies(islamicReplies);

        await api.sendMessage(`✅ Added Islamic reply: "${keyword}"`, event.threadID);
    },

    removeKeyword: async function (api, event, keyword) {
        if (!keyword) {
            return api.sendMessage("❌ Please specify keyword to remove", event.threadID);
        }

        const islamicReplies = this.getIslamicReplies();
        if (islamicReplies[keyword.toLowerCase()]) {
            delete islamicReplies[keyword.toLowerCase()];
            this.saveIslamicReplies(islamicReplies);
            await api.sendMessage(`✅ Removed: "${keyword}"`, event.threadID);
        } else {
            await api.sendMessage(`❌ Keyword "${keyword}" not found`, event.threadID);
        }
    },

    listKeywords: async function (api, event) {
        const islamicReplies = this.getIslamicReplies();
        const keywords = Object.keys(islamicReplies);

        if (keywords.length === 0) {
            return api.sendMessage("📝 No Islamic auto-reply keywords set yet.", event.threadID);
        }

        let message = `📖 Islamic Auto-Replies (${keywords.length}):\n\n`;
        keywords.slice(0, 15).forEach((keyword, index) => {
            message += `${index + 1}. ${keyword}\n`;
        });

        if (keywords.length > 15) {
            message += `\n... and ${keywords.length - 15} more Islamic keywords`;
        }

        message += `\n\n💡 Auto-reply is ${this.isAutoReplyEnabled() ? 'ENABLED ✅' : 'DISABLED ❌'}`;

        await api.sendMessage(message, event.threadID);
    },

    initializeIslamicReplies: function () {
        return {
            // Basic Islamic Greetings
            'assalamualaikum': 'Wa Alaikum Assalam Wa Rahmatullahi Wa Barakatuhu! 🌙\nMay the peace, mercy, and blessings of Allah be upon you.',
            'salam': 'Wa Alaikum Salam! How are you today? 🤲',
            'salaam': 'Wa Alaikum Salaam! May Allah bless you. ✨',
            
            // Quranic Verses
            'quran': '🕋 Quran is the word of Allah, a guidance for mankind.',
            'allah': '🤲 Allah is the Greatest! \n"He is Allah, the Creator, the Inventor, the Fashioner." (Quran 59:24)',
            'muhammad': '☪️ Prophet Muhammad (ﷺ) is the final messenger of Allah.',
            'islam': '🕌 Islam means submission to the will of Allah.',
            'iman': '💫 Iman (faith) is to believe in Allah, His angels, His books, His messengers.',
            
            // Pillars of Islam
            'shahada': '📿 La ilaha illallah, Muhammadur Rasulullah',
            'salah': '🕋 Salah (prayer) is the pillar of religion.',
            'sawm': '🌙 Fasting in Ramadan teaches self-restraint.',
            'zakat': '💰 Zakat purifies wealth.',
            'hajj': '🕋 Hajj is a journey of purification.',
            
            // Duas & Azkar
            'subhanallah': 'SubhanAllah! Glory be to Allah 🌟',
            'alhamdulillah': 'Alhamdulillah! All praise is for Allah 🙏',
            'allah hu akbar': 'Allahu Akbar! Allah is the Greatest 🕌',
            'la ilaha illallah': 'La ilaha illallah! There is no god but Allah 📿',
            'astaghfirullah': 'Astaghfirullah! I seek forgiveness from Allah 🤲',
            'mashallah': 'Masha Allah! As Allah has willed ✨',
            'inshallah': 'Insha Allah! If Allah wills 📅',
            
            // Prayer Times
            'fajr': '🌅 Fajr prayer: The morning prayer that brings light to your day.',
            'dhuhr': '☀️ Dhuhr prayer: The midday prayer.',
            'asr': '🌇 Asr prayer: The afternoon prayer.',
            'maghrib': '🌄 Maghrib prayer: The prayer at sunset.',
            'isha': '🌙 Isha prayer: The night prayer.',
            
            // Islamic Months
            'ramadan': '🌙 Ramadan Mubarak! Month of fasting and Quran.',
            'eid': '🎉 Eid Mubarak! May Allah accept our good deeds.',
            
            // Islamic Values
            'sabr': '⏳ Sabr (patience) is a great virtue.',
            'shukr': '🙏 Shukr (gratitude) increases blessings.',
            'tawakkul': '🤲 Tawakkul (trust in Allah) brings peace.',
            
            // Family in Islam
            'parents': '👨‍👩‍👧‍👦 Be kind to parents.',
            'mother': '🤱 Paradise lies under the feet of mothers.',
            
            // Islamic Knowledge
            'hadith': '📖 Hadith are the sayings of Prophet Muhammad (ﷺ).',
            'sunnah': '☪️ Sunnah is the way of Prophet Muhammad (ﷺ).',
            
            // Islamic Places
            'makkah': '🕋 Makkah: The holiest city in Islam.',
            'madina': '🌴 Madinah: City of Prophet Muhammad (ﷺ).',
            'kaaba': '🕋 Kaaba: The house of Allah.',
            
            // Duas
            'dua': '🤲 Dua is the weapon of the believer.',
            'for forgiveness': '🤲 "Rabbi inni zalamto nafsi faghfirli"',
            'for guidance': '🤲 "Rabbi zidni ilma"',
            
            // Daily Reminders
            'morning': '🌅 Morning Azkar: "SubhanAllahi wa bihamdihi"',
            'evening': '🌇 Evening Azkar: "Allahumma bika amsaina"',
            'sleep': '🌙 Before sleeping: Recite Ayat-ul-Kursi',
            
            // Spiritual Advice
            'depressed': '🤲 Turn to Allah in difficult times.',
            'anxious': '💫 Remember Allah brings peace to hearts.',
            'sick': '🤲 Illness erases sins. Be patient.',
            
            // Islamic Terms
            'wudu': '💧 Wudu: Ritual purification.',
            'halal': '✅ Halal: Permissible in Islam.',
            'haram': '❌ Haram: Forbidden in Islam.',
            
            // Final Messages
            'jannah': '🏞️ Jannah (Paradise): The eternal abode for believers.',
            'akhirah': '💫 Akhirah (Hereafter): The eternal life.',
            
            // Short Duas
            'ameen': 'Ameen! May Allah accept our prayers 🤲',
            'jazakallah': 'JazakAllahu Khairan! May Allah reward you 🙏',
            'barakallah': 'BarakAllahu Feek! May Allah bless you ✨'
        };
    },

    findBestMatch: function (message, islamicReplies) {
        const words = message.toLowerCase().split(' ');
        
        if (islamicReplies[message]) {
            return islamicReplies[message];
        }
        
        for (const word of words) {
            if (word.length > 2 && islamicReplies[word]) {
                return islamicReplies[word];
            }
        }
        
        for (const [keyword, response] of Object.entries(islamicReplies)) {
            if (message.includes(keyword) && keyword.length > 3) {
                return response;
            }
        }
        
        return null;
    }
};
