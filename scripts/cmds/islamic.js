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

        // Handle different actions
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
            // Prevent self-reply loop
            if (event.senderID === api.getCurrentUserID()) return;
            
            // Check if auto-reply is enabled
            if (!this.isAutoReplyEnabled()) return;
            
            const message = event.body?.toLowerCase().trim();
            if (!message) return;

            // Get Islamic replies
            const islamicReplies = this.getIslamicReplies();
            
            // Smart keyword matching
            const matchedReply = this.findBestMatch(message, islamicReplies);
            
            if (matchedReply) {
                // Random delay to make it natural (1-3 seconds)
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

    // Get Islamic replies from memory
    getIslamicReplies: function () {
        if (!global.islamicReplyData) {
            global.islamicReplyData = this.initializeIslamicReplies();
        }
        return global.islamicReplyData;
    },

    // Save Islamic replies to memory
    saveIslamicReplies: function (data) {
        global.islamicReplyData = data;
    },

    // Check if auto-reply is enabled
    isAutoReplyEnabled: function () {
        if (typeof global.islamicAutoReplyEnabled === 'undefined') {
            global.islamicAutoReplyEnabled = true; // Default enabled
        }
        return global.islamicAutoReplyEnabled;
    },

    // Toggle auto-reply
    toggleAutoReply: async function (api, event, status) {
        global.islamicAutoReplyEnabled = status;
        await api.sendMessage(
            `✅ Islamic auto-reply ${status ? 'enabled' : 'disabled'}!`,
            event.threadID
        );
    },

    // Add keyword
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

    // Remove keyword
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

    // List keywords
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

    // Initialize with comprehensive Islamic replies
    initializeIslamicReplies: function () {
        return {
            // 🕌 BASIC ISLAMIC GREETINGS & PHRASES
            'assalamualaikum': 'Wa Alaikum Assalam Wa Rahmatullahi Wa Barakatuhu! 🌙\nMay the peace, mercy, and blessings of Allah be upon you.',
            'salam': 'Wa Alaikum Salam! How are you today? 🤲',
            'salaam': 'Wa Alaikum Salaam! May Allah bless you. ✨',
            
            // 📖 QURANIC VERSES & REFERENCES
            'quran': '🕋 Quran is the word of Allah, a guidance for mankind. \n"Indeed, this Quran guides to that which is most suitable..." (Quran 17:9)',
            'allah': '🤲 Allah is the Greatest! \n"He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names." (Quran 59:24)',
            'muhammad': '☪️ Prophet Muhammad (ﷺ) is the final messenger of Allah. \n"And We have not sent you except as a mercy to the worlds." (Quran 21:107)',
            'islam': '🕌 Islam means submission to the will of Allah. \n"Indeed, the religion in the sight of Allah is Islam." (Quran 3:19)',
            'iman': '💫 Iman (faith) is to believe in Allah, His angels, His books, His messengers, the Last Day, and divine decree.',
            
            // 🕌 PILLARS OF ISLAM
            'shahada': '📿 La ilaha illallah, Muhammadur Rasulullah \n(There is no god but Allah, Muhammad is the Messenger of Allah)',
            'salah': '🕋 Salah (prayer) is the pillar of religion. \n"Indeed, prayer has been decreed upon the believers a decree of specified times." (Quran 4:103)',
            'sawm': '🌙 Fasting in Ramadan teaches self-restraint. \n"O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous." (Quran 2:183)',
            'zakat': '💰 Zakat purifies wealth. \n"Take charity from their wealth to purify them and cause them to increase." (Quran 9:103)',
            'hajj': '🕋 Hajj is a journey of purification. \n"And Hajj to the House is a duty that mankind owes to Allah." (Quran 3:97)',
            
            // 🤲 DUAS & AZKAR
            'subhanallah': 'SubhanAllah! Glory be to Allah 🌟\n"سبحان الله"',
            'alhamdulillah': 'Alhamdulillah! All praise is for Allah 🙏\n"الحمد لله"',
            'allah hu akbar': 'Allahu Akbar! Allah is the Greatest 🕌\n"الله أكبر"',
            'la ilaha illallah': 'La ilaha illallah! There is no god but Allah 📿',
            'astaghfirullah': 'Astaghfirullah! I seek forgiveness from Allah 🤲\n"أستغفر الله"',
            'mashallah': 'Masha Allah! As Allah has willed ✨\n"ما شاء الله"',
            'inshallah': 'Insha Allah! If Allah wills 📅\n"إن شاء الله"',
            
            // 🕋 PRAYER TIMES & REMINDERS
            'fajr': '🌅 Fajr prayer: The morning prayer that brings light to your day. \n"Establish prayer at the decline of the sun until the darkness of the night and the Quran at dawn. Indeed, the recitation of the Quran at dawn is ever witnessed." (Quran 17:78)',
            'dhuhr': '☀️ Dhuhr prayer: The midday prayer that reconnects you with Allah.',
            'asr': '🌇 Asr prayer: The afternoon prayer before sunset.',
            'maghrib': '🌄 Maghrib prayer: The prayer at sunset.',
            'isha': '🌙 Isha prayer: The night prayer that completes your day.',
            
            // 🌙 ISLAMIC MONTHS & OCCASIONS
            'ramadan': '🌙 Ramadan Mubarak! Month of fasting, prayer, and Quran. \n"The month of Ramadan in which was revealed the Quran, a guidance for mankind..." (Quran 2:185)',
            'eid': '🎉 Eid Mubarak! May Allah accept our good deeds and forgive our sins.',
            'muharram': '📅 Muharram: The sacred month, first month of Islamic calendar.',
            'hijri': '📆 Hijri calendar is based on the lunar cycle.',
            
            // 💫 ISLAMIC VALUES
            'sabr': '⏳ Sabr (patience) is a great virtue. \n"Indeed, Allah is with the patient." (Quran 2:153)',
            'shukr': '🙏 Shukr (gratitude) increases blessings. \n"And if you should count the favors of Allah, you could not enumerate them." (Quran 14:34)',
            'tawakkul': '🤲 Tawakkul (trust in Allah) brings peace. \n"And rely upon Allah; and sufficient is Allah as Disposer of affairs." (Quran 33:3)',
            'taqwa': '🛡️ Taqwa (God-consciousness) is the key to success. \n"And take provisions, but indeed, the best provision is Taqwa." (Quran 2:197)',
            
            // 🏠 FAMILY & RELATIONSHIPS IN ISLAM
            'parents': '👨‍👩‍👧‍👦 Be kind to parents. \n"And your Lord has decreed that you not worship except Him, and to parents, good treatment." (Quran 17:23)',
            'mother': '🤱 Paradise lies under the feet of mothers. (Hadith)',
            'family': '🏠 Family is a blessing from Allah. Maintain good relations with relatives.',
            
            // 📚 ISLAMIC KNOWLEDGE
            'hadith': '📖 Hadith are the sayings and actions of Prophet Muhammad (ﷺ).',
            'sunnah': '☪️ Sunnah is the way of Prophet Muhammad (ﷺ).',
            'fiqh': '📚 Fiqh is Islamic jurisprudence.',
            'tawhid': '✨ Tawhid is the oneness of Allah.',
            
            // 🕌 ISLAMIC PLACES
            'makkah': '🕋 Makkah: The holiest city in Islam, home to Kaaba.',
            'madina': '🌴 Madinah: City of Prophet Muhammad (ﷺ).',
            'kaaba': '🕋 Kaaba: The house of Allah in Makkah.',
            'masjid': '🕌 Masjid: Place of worship for Muslims.',
            
            // 🤲 DUAS FOR DIFFERENT OCCASIONS
            'dua': '🤲 Dua is the weapon of the believer. \n"And your Lord says, Call upon Me; I will respond to you." (Quran 40:60)',
            'for forgiveness': '🤲 "Rabbi inni zalamto nafsi faghfirli" \n(My Lord, I have wronged myself, so forgive me)',
            'for guidance': '🤲 "Rabbi zidni ilma" \n(My Lord, increase me in knowledge)',
            'for protection': '🤲 "Hasbunallahu wa ni'mal wakeel" \n(Allah is sufficient for us, and He is the best Disposer of affairs)',
            
            // 🌟 DAILY REMINDERS
            'morning': '🌅 Morning Azkar: \n"SubhanAllahi wa bihamdihi" x100 \nWhoever says this in the morning will have a tree planted for him in Paradise.',
            'evening': '🌇 Evening Azkar: \n"Allahumma bika amsaina wa bika asbahna" \n(O Allah, by You we enter the evening and by You we enter the morning)',
            'sleep': '🌙 Before sleeping: \nRecite Ayat-ul-Kursi and Surah Ikhlas, Falaq, Nas',
            'waking up': '☀️ Upon waking: \n"Alhamdulillahil-lathee ahyana ba'da ma amatana wa ilayhin-nushoor" \n(All praise is for Allah who gave us life after death, and to Him is the resurrection)',
            
            // 💖 SPIRITUAL ADVICE
            'depressed': '🤲 Turn to Allah in difficult times. \n"Indeed, with hardship comes ease." (Quran 94:6)',
            'anxious': '💫 Remember Allah brings peace to hearts. \n"Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)',
            'happy': 'Alhamdulillah! Share your happiness with others and be grateful to Allah.',
            'sick': '🤲 Illness erases sins. Be patient and seek cure through Quran and medicine.',
            
            // 🕌 BASIC ISLAMIC TERMS
            'wudu': '💧 Wudu: Ritual purification before prayer.',
            'gusal': '🚿 Ghusl: Full body purification.',
            'halal': '✅ Halal: Permissible in Islam.',
            'haram': '❌ Haram: Forbidden in Islam.',
            'sunnah': '☪️ Sunnah: Practices of Prophet Muhammad (ﷺ).',
            'mustahabb': '👍 Mustahabb: Recommended actions.',
            'makruh': '⚠️ Makruh: Disliked actions.',
            
            // 🎯 FINAL MESSAGES
            'jannah': '🏞️ Jannah (Paradise): The eternal abode for believers. \n"No soul knows what has been hidden for them of comfort for eyes as reward for what they used to do." (Quran 32:17)',
            'jahannam': '🔥 Jahannam (Hell): May Allah protect us from it.',
            'qayamat': '⏰ Qayamat (Day of Judgment): Every soul will be accounted for.',
            'akhirah': '💫 Akhirah (Hereafter): The eternal life after death.',
            
            // 🤲 SHORT DUAS
            'ameen': 'Ameen! May Allah accept our prayers 🤲',
            'jazakallah': 'JazakAllahu Khairan! May Allah reward you with good 🙏',
            'barakallah': 'BarakAllahu Feek! May Allah bless you ✨',
            'fi amanillah': 'Fi Amanillah! May Allah protect you 🛡️',
            'yarhamukallah': 'YarhamukAllah! May Allah have mercy on you 🤲'
        };
    },

    // Smart matching algorithm
    findBestMatch: function (message, islamicReplies) {
        const words = message.toLowerCase().split(' ');
        
        // Try exact match first
        if (islamicReplies[message]) {
            return islamicReplies[message];
        }
        
        // Try word-by-word matching
        for (const word of words) {
            if (word.length > 2 && islamicReplies[word]) {
                return islamicReplies[word];
            }
        }
        
        // Try partial matching for longer phrases
        for (const [keyword, response] of Object.entries(islamicReplies)) {
            if (message.includes(keyword) && keyword.length > 3) {
                return response;
            }
        }
        
        return null;
    }
};
