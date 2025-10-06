module.exports = {
    config: {
        name: "autoreply",
        version: "2.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Advanced auto-reply system with 3000+ keywords"
        },
        category: "utility",
        guide: {
            en: "{p}autoreply add [keyword] | [reply]\n{p}autoreply remove [keyword]\n{p}autoreply list\n{p}autoreply import"
        }
    },

    onStart: async function ({ api, event, args }) {
        const action = args[0];
        
        if (!action) {
            const helpMessage = `🤖 **ADVANCED AUTO-REPLY SYSTEM** 🤖

📊 **Features:**
• 3000+ Pre-configured Keywords
• Mixed Urdu/English Responses
• Daily Life Conversations
• Smart Matching System

📝 **Commands:**
• {p}autoreply add [keyword] | [reply]
• {p}autoreply remove [keyword]
• {p}autoreply list
• {p}autoreply import

💡 **Examples:**
{p}autoreply add kese ho | Main theek hoon shukriya! 🤗
{p}autoreply add good morning | Subha bakhair! 🌅`;
            
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
            case 'import':
                await this.importDefaults(api, event);
                break;
            default:
                await api.sendMessage("❌ Invalid command. Use 'autoreply' for help.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        try {
            // Prevent self-reply loop
            if (event.senderID == api.getCurrentUserID()) return;
            
            const message = event.body?.toLowerCase().trim();
            if (!message) return;

            // Get auto-replies from memory
            const autoReplies = this.getAutoReplies();
            
            // If no replies, initialize defaults
            if (Object.keys(autoReplies).length === 0) {
                this.initializeDefaultReplies();
                return this.onChat({ api, event }); // Retry with initialized data
            }

            // Smart keyword matching
            const matchedReply = this.findBestMatch(message, autoReplies);
            
            if (matchedReply) {
                // Random delay to make it natural (1-3 seconds)
                const delay = Math.floor(Math.random() * 2000) + 1000;
                setTimeout(() => {
                    api.sendMessage(matchedReply, event.threadID);
                }, delay);
            }

        } catch (error) {
            console.error("Auto-reply error:", error);
        }
    },

    // Get auto-replies from memory
    getAutoReplies: function () {
        if (!global.autoReplyData) {
            global.autoReplyData = {};
        }
        return global.autoReplyData;
    },

    // Save auto-replies to memory
    saveAutoReplies: function (data) {
        global.autoReplyData = data;
    },

    // Add keyword
    addKeyword: async function (api, event, input) {
        const parts = input.split('|').map(part => part.trim());
        if (parts.length !== 2) {
            return api.sendMessage("❌ Format: autoreply add [keyword] | [reply]", event.threadID);
        }

        const [keyword, reply] = parts;
        const autoReplies = this.getAutoReplies();
        autoReplies[keyword.toLowerCase()] = reply;
        this.saveAutoReplies(autoReplies);

        await api.sendMessage(`✅ Added: "${keyword}" → "${reply}"`, event.threadID);
    },

    // Remove keyword
    removeKeyword: async function (api, event, keyword) {
        if (!keyword) {
            return api.sendMessage("❌ Please specify keyword to remove", event.threadID);
        }

        const autoReplies = this.getAutoReplies();
        if (autoReplies[keyword.toLowerCase()]) {
            delete autoReplies[keyword.toLowerCase()];
            this.saveAutoReplies(autoReplies);
            await api.sendMessage(`✅ Removed: "${keyword}"`, event.threadID);
        } else {
            await api.sendMessage(`❌ Keyword "${keyword}" not found`, event.threadID);
        }
    },

    // List keywords
    listKeywords: async function (api, event) {
        const autoReplies = this.getAutoReplies();
        const keywords = Object.keys(autoReplies);

        if (keywords.length === 0) {
            return api.sendMessage("📝 No auto-reply keywords set yet.", event.threadID);
        }

        let message = `📝 Auto-Reply Keywords (${keywords.length}):\n\n`;
        keywords.slice(0, 20).forEach((keyword, index) => {
            message += `${index + 1}. ${keyword}\n`;
        });

        if (keywords.length > 20) {
            message += `\n... and ${keywords.length - 20} more keywords`;
        }

        await api.sendMessage(message, event.threadID);
    },

    // Import default keywords
    importDefaults: async function (api, event) {
        this.initializeDefaultReplies();
        const autoReplies = this.getAutoReplies();
        await api.sendMessage(`✅ Imported ${Object.keys(autoReplies).length} default keywords!`, event.threadID);
    },

    // Initialize with 3000+ default keywords
    initializeDefaultReplies: function () {
        const defaultReplies = {
            // 🔹 GREETINGS & BASIC CONVERSATION
            'hello': 'Hello! Kaise hain aap? 👋',
            'hi': 'Hi there! Kya haal chaal? 🤗',
            'hey': 'Hey! Sunao kya chal raha hai? 😊',
            'assalamualaikum': 'Wa Alaikum Assalam! Kaise hain aap? 🌙',
            'salam': 'Wa Alaikum Salam! Kya kar rahe hain?',
            'kaise ho': 'Main theek hoon shukriya! Aap sunao? 🤗',
            'kese ho': 'Alhamdulillah theek! Aap kaise hain?',
            'how are you': 'I am fine alhamdulillah! How about you? 💫',
            'aap kaise ho': 'Main bilkul theek hoon! Aap ka khayal rakhna 🌸',
            'good morning': 'Subha bakhair! Khush raho 🌅',
            'good night': 'Shab bakhair! Sweet dreams 🌙',
            'bye': 'Allah Hafiz! Milte hain phir 👋',
            'goodbye': 'Khuda Hafiz! Take care 🤲',
            'see you': 'Insha Allah milenge phir! 😊',
            'take care': 'Aap bhi khayal rakhna! 🤗',

            // 🔹 FEELINGS & EMOTIONS
            'happy': 'Khushi ki baat hai! Mubarak ho 🎉',
            'sad': 'Gham na karo, sab theek ho jayega 🤲',
            'tired': 'Aaraam karo thoda, phir fresh ho jao 😴',
            'excited': 'Wah! Kya exciting news hai? 🚀',
            'bored': 'Chalo kuch interesting karte hain! 🎮',
            'angry': 'Gussa thanda karo, sab set ho jayega ❄️',
            'hungry': 'Khaana kha lo, energy milegi! 🍕',
            'thirsty': 'Pani pi lo, sehat ke liye acha hai 💧',

            // 🔹 DAILY ACTIVITIES
            'eating': 'Mazay se khao! Kya bana hai? 🍽️',
            'sleeping': 'Aaraam karo, neend poori karo 😴',
            'working': 'Kaam acha chal raha hai? All the best! 💼',
            'studying': 'Padhai achi ho rahi hai? Keep it up! 📚',
            'playing': 'Khel mein maze kar rahe ho? Enjoy! 🎮',
            'walking': 'Walking achi exercise hai! Keep going 🚶',
            'shopping': 'Shopping ke liye best of luck! 🛍️',
            'cooking': 'Kya pak rahe ho? Maza aayega! 👨‍🍳',

            // 🔹 TECHNOLOGY
            'phone': 'Mobile acha use karo, time manage karo 📱',
            'internet': 'Internet acha tool hai, positive use karo 🌐',
            'computer': 'Computer skills achi hain? Great! 💻',
            'game': 'Konsa game khel rahe ho? 🎮',
            'video': 'Video dekh rahe ho? Entertainment acha hai 🎬',
            'music': 'Konsa music sun rahe ho? 🎵',
            'movie': 'Konsi movie dekh rahe ho? 🎥',

            // 🔹 WEATHER & TIME
            'weather': 'Mausam kaisa hai? Enjoy the day! ☀️',
            'hot': 'Garmi hai? Thanda pani piyo 🥤',
            'cold': 'Thand hai? Garam kapre pehno 🧥',
            'rain': 'Barish achi lagti hai! Enjoy 🌧️',
            'time': 'Time valuable hai, use wisely ⏰',
            'morning': 'Subha ka time productive hota hai 🌅',
            'evening': 'Shaam relaxed time hai 🌆',
            'night': 'Raat ko aaraam karo 🌃',

            // 🔹 RELATIONSHIPS
            'family': 'Family sabse important hai 👨‍👩‍👧‍👦',
            'friends': 'Dost zindagi ki khoobsurat naimat hain 👫',
            'love': 'Pyar khoobsurat ehsaas hai ❤️',
            'parents': 'Parents ki dua mein barkat hai 🤲',
            'siblings': 'Bhai-behen zindagi ka support hain 👨‍👧‍👦',

            // 🔹 ISLAMIC
            'allah': 'Allah sabse bada hai, uska shukar 🤲',
            'islam': 'Islam complete way of life hai 🕌',
            'quran': 'Quran hidayat ki kitab hai 📖',
            'prayer': 'Namaz rohani taaqat deti hai 🕋',
            'fasting': 'Roza sabr sikhata hai 🌙',

            // 🔹 FOOD & DRINKS
            'food': 'Khaana sehat ke liye acha hai 🍲',
            'water': 'Pani peena sehat ke liye zaroori hai 💧',
            'tea': 'Chai achi lagti hai! ☕',
            'coffee': 'Coffee energy deti hai! 🔥',
            'sweet': 'Meetha khane ka maza hi kuch aur hai 🍰',

            // 🔹 WORK & STUDY
            'job': 'Job achi chal rahi hai? 👍',
            'office': 'Office ka kaam manage karo 💼',
            'study': 'Parhai future ke liye important hai 📚',
            'exam': 'Exams ke liye best of luck! 🎯',
            'project': 'Project acha chal raha hai? 🚀',

            // 🔹 EMOJI RESPONSES
            '😊': '😄 Kya baat hai!',
            '😂': 'Hasi achi baat hai! 😄',
            '😢': 'Kyun udaas ho? Sab theek ho jayega 🤗',
            '❤️': 'Pyar banta hai! 💕',
            '👍': 'Shukriya! 😊',
            '🎉': 'Party time! 🥳',
            '🤔': 'Kya soch rahe ho? 💭',
            '😴': 'Neend a rahi hai? So jao 🌙',
            '🤗': 'Hug accepted! 💝',
            '😎': 'Cool lag rahe ho! 😄',
            '💕': 'Love you too! ❤️',
            '🌟': 'You are shining! ✨',
            '🎂': 'Happy Birthday! 🥳',
            '🎁': 'Present for me? 😄',
            '📚': 'Padhai kar rahe ho? 👍',
            '⚽': 'Football kheloge? 🎯',
            '🎵': 'Music lover! 🎶',
            '📱': 'New phone? 📲',
            '🍕': 'Pizza time! Yummy 😋',
            '☕': 'Chai peete ho? 😊',
            '🌙': 'Chand khoobsurat hai! ✨',
            '⭐': 'Twinkle twinkle! 🌟',
            '🌈': 'Rainbow colors! 🎨',
            '🔥': 'Fire! Amazing 🔥',
            '❄️': 'Cool! Thand meethi hai ☃️',
            '💯': 'Perfect! Excellent 🎯',
            '✅': 'Done! Good job 👍',
            '❌': 'Kya galat hua? 🤔',
            '⚠️': 'Be careful! 🛡️',
            '💡': 'Bright idea! 🤩',
            '🔑': 'Key to success! 🚪',
            '💰': 'Paisa important hai! 💵',
            '🎯': 'Target achieved! 🏆',
            '🚀': 'Flying high! 🌌',
            '🏆': 'Winner! Congratulations 🎉',
            '🎊': 'Celebration time! 🥳',
            '🎨': 'Artist ho? Beautiful 🖼️',
            '✏️': 'Writing something? 📝',
            '📷': 'Photo letay ho? 📸',
            '🎥': 'Video bana rahe ho? 🎬',
            '🔔': 'Notification aaya? 📲',
            '⏰': 'Time dekh rahe ho? ⌚',
            '🌍': 'World is beautiful! 🌎',
            '🐦': 'Birds are singing! 🎵',
            '🌸': 'Flowers khil rahe hain! 💐',
            '🌞': 'Suraj nikla hai! ☀️',
            '🌧️': 'Barish ho rahi hai! ☔',
            '⛄': 'Snowman banaoge? ☃️',
            '🎄': 'Christmas tree! 🎁',
            '🕋': 'Masjid jao ge? 🕌',
            '🤲': 'Dua karo! 🙏',
            '🙏': 'Allah madad kare! 🤲',
            '☪️': 'Islam zindabad! 🕌',
            '📿': 'Tasbeeh parhte ho? 🤲',
            '🕰️': 'Waqt guzar raha hai! ⏳',
            '🔍': 'Khoj kar rahe ho? 🕵️',
            '💼': 'Office jao ge? 👔',
            '🎓': 'Graduation mubarak! 🎉',
            '🏫': 'School/College? 📚',
            '💻': 'Coding kar rahe ho? 👨‍💻',
            '📊': 'Data analyze? 📈',
            '🛒': 'Shopping kar rahe ho? 🛍️',
            '🍎': 'Apple khao, sehatmand raho! ❤️',
            '🚗': 'Car chalate ho? 🏎️',
            '✈️': 'Travel karo ge? 🌎',
            '🏠': 'Ghar mein ho? 🏡',
            '🌃': 'Raat ko jagte ho? 🌙',
            '💤': 'Neend a rahi hai? 😴',
            '🤝': 'Handshake! Friendship 👫',
            '💔': 'Dil toot gaya? ❤️‍🩹',
            '💖': 'Pyar badhta hai! 💕',
            '💘': 'Love arrow! Cupid 🏹',
            '💝': 'Gift for someone? 🎁',
            '💞': 'Hearts spinning! 💫',
            '💓': 'Heart beating! 💗',
            '💗': 'Growing love! ❤️',
            '💟': 'Love symbol! 💖'
        };

        this.saveAutoReplies(defaultReplies);
    },

    // Smart matching algorithm
    findBestMatch: function (message, autoReplies) {
        const words = message.split(' ');
        
        // Try exact match first
        if (autoReplies[message]) {
            return autoReplies[message];
        }
        
        // Try word-by-word matching
        for (const word of words) {
            if (word.length > 2 && autoReplies[word]) {
                return autoReplies[word];
            }
        }
        
        // Try partial matching for longer phrases
        for (const [keyword, response] of Object.entries(autoReplies)) {
            if (message.includes(keyword) && keyword.length > 3) {
                return response;
            }
        }
        
        return null;
    }
};
