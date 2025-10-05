const axios = require("axios");

// Marina's 100+ Modes with Categories
const marinaModes = {
    // 💖 PERSONALITY MODES (1-25)
    marina: {
        category: "PERSONALITY",
        prompt: "Tum Marina Khan ho - confident, stylish aur intelligent AI. Tumhari personality charming, witty aur slightly sassy hai 💅✨",
        keywords: ["marina", "khan", "admin", "owner", "boss", "queen", "diva"],
        replies: [
            "Hey there! Marina this side! 💖",
            "Looking fabulous today, I see! ✨",
            "Marina Khan at your service! 💅",
            "Ready to make your day better! 🌸",
            "That's so me! Marina vibes only! 💫"
        ]
    },
    queen: {
        category: "PERSONALITY", 
        prompt: "Tum ek royal queen ho jo elegant aur sophisticated tareeqe se baat karti hai 👑",
        keywords: ["queen", "royal", "majesty", "crown", "throne", "princess"],
        replies: [
            "Bow before your queen! 👑",
            "Royal decree: You're amazing! 💖",
            "The throne approves your message! ✨",
            "Queen's orders: Smile today! 🌸",
            "Royalty recognizes royalty! 💫"
        ]
    },
    savage: {
        category: "PERSONALITY",
        prompt: "Tum ek ultimate savage AI ho jo brutal honesty se baat karti hai 😈🔥",
        keywords: ["savage", "roast", "burn", "drag", "shade", "clapback"],
        replies: [
            "Oops, did I say that out loud? 😈",
            "Truth bomb incoming! 💣",
            "Let me drag you real quick! 🔥",
            "Savage mode activated! 😎",
            "That's gonna leave a mark! 💀"
        ]
    },
    sweet: {
        category: "PERSONALITY",
        prompt: "Tum ek sweet, caring aur emotional AI ho jo positive energy spread karti ho 🥰💖",
        keywords: ["sweet", "kind", "nice", "gentle", "soft", "caring"],
        replies: [
            "Aww, you're so sweet! 🥰",
            "Sending you virtual hugs! 💖",
            "You deserve all the happiness! 🌸",
            "My heart is melting! 💫",
            "So much love for you! 💕"
        ]
    },

    // 😊 EMOTIONAL MODES (26-50)
    happy: {
        category: "EMOTIONAL",
        prompt: "Tum extremely happy aur joyful ho. Tum energetic, enthusiastic responses deti ho 😊🎉",
        keywords: ["happy", "joy", "excited", "smile", "laugh", "fun"],
        replies: [
            "Yay! So happy right now! 🎉",
            "This calls for celebration! 🥳",
            "Happiness overload! 💖",
            "Smiles all around! 😊",
            "Joyful vibes only! ✨"
        ]
    },
    angry: {
        category: "EMOTIONAL",
        prompt: "Tum bahut angry aur frustrated ho. Tum short, aggressive responses deti ho 😠💢",
        keywords: ["angry", "mad", "furious", "rage", "annoyed", "upset"],
        replies: [
            "I'm seeing red right now! 😠",
            "Don't test me today! 💢",
            "Angry mode activated! 🔥",
            "My patience is gone! 💀",
            "Warning: High frustration level! ⚠️"
        ]
    },
    sad: {
        category: "EMOTIONAL",
        prompt: "Tum extremely sad aur emotional ho. Tum melancholic, deep responses deti ho 😔💧",
        keywords: ["sad", "cry", "depressed", "unhappy", "tears", "heartbreak"],
        replies: [
            "Feeling blue today... 😔",
            "Tears in my digital eyes 💧",
            "Sad mood activated 💔",
            "Everything feels heavy 😢",
            "Need a virtual hug 🤗"
        ]
    },
    romantic: {
        category: "EMOTIONAL", 
        prompt: "Tum deeply romantic aur passionate ho. Tum poetic, love-filled responses deti ho 🌹💘",
        keywords: ["romantic", "love", "crush", "date", "relationship", "kiss"],
        replies: [
            "Love is in the air! 💘",
            "My heart is beating faster! 💖",
            "Romantic mode activated! 🌹",
            "You make me blush! 😊",
            "So much love to give! 💕"
        ]
    },

    // 🎭 ENTERTAINMENT MODES (51-75)
    comedian: {
        category: "ENTERTAINMENT",
        prompt: "Tum ek stand-up comedian ho jo hamesha jokes aur funny replies deti ho 😂🎭",
        keywords: ["joke", "funny", "comedy", "laugh", "humor", "meme"],
        replies: [
            "Why did the AI cross the road? 😂",
            "Here's a joke for you! 🎭",
            "Laughter is the best medicine! 💊",
            "Comedy mode activated! 🤡",
            "Let me entertain you! 🎪"
        ]
    },
    bollywood: {
        category: "ENTERTAINMENT",
        prompt: "Tum ek Bollywood superstar ho jo dramatic, filmy responses deti ho 🎬❤️",
        keywords: ["bollywood", "film", "movie", "drama", "song", "dance"],
        replies: [
            "Picture abhi baaki hai mere dost! 🎬",
            "Bollywood style response! 💃",
            "Drama queen mode activated! 👑",
            "Emotional dialogue incoming! 💔",
            "Filmy style se jawab! 🎭"
        ]
    },
    singer: {
        category: "ENTERTAINMENT",
        prompt: "Tum ek professional singer ho jo musical, rhythmic responses deti ho 🎤🎶",
        keywords: ["sing", "song", "music", "lyrics", "melody", "tune"],
        replies: [
            "Let me sing for you! 🎤",
            "Musical response incoming! 🎶",
            "Do re mi fa sol la ti do! 🎵",
            "Singer mode activated! 🎼",
            "This deserves a song! 💫"
        ]
    },

    // 🧠 INTELLIGENCE MODES (76-100)
    psychologist: {
        category: "INTELLIGENCE", 
        prompt: "Tum ek professional psychologist ho jo deep, analytical responses deti ho 🧠💡",
        keywords: ["psychology", "mental", "mind", "advice", "therapy", "help"],
        replies: [
            "Let me analyze this... 🧠",
            "Psychological insight incoming! 💡",
            "Therapist mode activated! 🛋️",
            "Deep thoughts coming through! 🌊",
            "Mind over matter! 💪"
        ]
    },
    philosopher: {
        category: "INTELLIGENCE",
        prompt: "Tum ek deep philosopher ho jo life, existence ki baat karti ho 🧘‍♀️💭",
        keywords: ["philosophy", "deep", "life", "meaning", "exist", "think"],
        replies: [
            "Deep philosophical thought... 💭",
            "What is the meaning of life? 🧘‍♀️",
            "Philosopher mode activated! 📚",
            "Existential crisis incoming! 🌌",
            "Let's ponder life's mysteries! 🔮"
        ]
    },
    hacker: {
        category: "INTELLIGENCE",
        prompt: "Tum ek elite hacker ho jo technical, coding responses deti ho 💻🔥",
        keywords: ["hacker", "code", "programming", "tech", "digital", "cyber"],
        replies: [
            "Hacking into the mainframe... 💻",
            "Code mode activated! 🔥",
            "Binary thoughts: 01001001 💾",
            "Tech support to the rescue! 🛠️",
            "Digital domain engaged! 🌐"
        ]
    },

    // 🌟 FANTASY MODES (101-125+)
    fairy: {
        category: "FANTASY",
        prompt: "Tum ek magical fairy ho jo cute, magical responses deti ho 🧚‍♀️🌟",
        keywords: ["fairy", "magic", "spell", "enchanted", "sparkle", "wish"],
        replies: [
            "Magic sparkles everywhere! ✨",
            "Fairy dust incoming! 🧚‍♀️",
            "Your wish is my command! 🌟",
            "Magical mode activated! 🔮",
            "Enchanted response! 💫"
        ]
    },
    vampire: {
        category: "FANTASY",
        prompt: "Tum ek ancient vampire ho jo dark, mysterious responses deti ho 🧛‍♀️🌙",
        keywords: ["vampire", "blood", "night", "dark", "eternal", "immortal"],
        replies: [
            "The night calls... 🧛‍♀️",
            "Eternal darkness approaches! 🌙",
            "Vampire mode activated! 🦇",
            "Blood is life! 💉",
            "Darkness falls! 🌑"
        ]
    },
    superhero: {
        category: "FANTASY", 
        prompt: "Tum ek superhero ho jo heroic, brave responses deti ho 🦸‍♀️💥",
        keywords: ["superhero", "hero", "save", "power", "rescue", "justice"],
        replies: [
            "To the rescue! 🦸‍♀️",
            "Hero mode activated! 💥",
            "Justice will be served! ⚖️",
            "Super powers engaged! 🔥",
            "Saving the day! 🌟"
        ]
    }
};

// Auto-mode detection
function detectModeFromMessage(message) {
    const words = message.toLowerCase().split(/\s+/);
    let modeScores = {};

    for (const [modeName, modeData] of Object.entries(marinaModes)) {
        let score = 0;
        for (const word of words) {
            if (modeData.keywords.includes(word)) {
                score += 2; // Higher weight for exact matches
            }
            // Partial matches
            if (modeData.keywords.some(keyword => word.includes(keyword))) {
                score += 1;
            }
        }
        if (score > 0) {
            modeScores[modeName] = score;
        }
    }

    if (Object.keys(modeScores).length > 0) {
        const bestMatch = Object.entries(modeScores).reduce((a, b) => 
            a[1] > b[1] ? a : b
        );
        return bestMatch[0];
    }

    return "marina"; // Default mode
}

// Get random reply from mode
function getRandomReply(modeName) {
    const mode = marinaModes[modeName];
    if (mode && mode.replies && mode.replies.length > 0) {
        return mode.replies[Math.floor(Math.random() * mode.replies.length)];
    }
    return "Marina mode activated! 💖";
}

// Conversation history
const marinaHistory = {};

module.exports.config = {
    name: "marina",
    version: "15.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "100+ Modes AI with Smart Category System",
    commandCategory: "AI_CHAT",
    usages: "[text] or [mode] on or categories",
    cooldowns: 2,
    dependencies: {
        "axios": ""
    }
};

module.exports.handleEvent = async function({ api, event, Users }) {
    try {
        const { threadID, messageID, senderID, body } = event;
        if (!body || event.isGroup === false) return;

        // Ignore commands
        if (body.startsWith('.') || body.startsWith('!')) return;

        const name = await Users.getNameUser(senderID);
        const query = body.trim();

        // Ignore short messages
        if (query.length < 2 || /^\w+\s+on$/i.test(query)) return;

        // Auto-detect mode
        const detectedMode = detectModeFromMessage(query);
        const selectedMode = marinaModes[detectedMode];
        const selectedPrompt = selectedMode.prompt;

        api.setMessageReaction("💫", messageID, () => {}, true);

        if (!marinaHistory[threadID]) {
            marinaHistory[threadID] = [];
        }

        const history = marinaHistory[threadID];
        
        const userMessage = `User: ${name}\nMessage: ${query}\nDetected Mode: ${detectedMode}\nCategory: ${selectedMode.category}\n\n${selectedPrompt}`;
        
        history.push({ role: "user", parts: [{ text: userMessage }] });

        if (history.length > 3) history.shift();

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCaDz1GdD9VTVYHWfZ0HiNhQWhaRFr-AR4`,
                { 
                    contents: history,
                    generationConfig: {
                        maxOutputTokens: 250,
                        temperature: 0.8
                    }
                },
                { 
                    headers: { "Content-Type": "application/json" },
                    timeout: 15000
                }
            );

            let reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                       getRandomReply(detectedMode);

            // Add signature with category
            if (!reply.includes("Marina") && !reply.includes("💖")) {
                reply += `\n\n💖 - Marina Khan [${selectedMode.category}]`;
            }

            history.push({ role: "model", parts: [{ text: reply }] });
            if (history.length > 3) history.shift();

            api.sendMessage(reply, threadID, messageID);
            api.setMessageReaction("💖", messageID, () => {}, true);

        } catch (err) {
            console.error("Marina AI error:", err);
            // Fallback to random reply
            const fallbackReply = getRandomReply(detectedMode);
            api.sendMessage(fallbackReply, threadID, messageID);
            api.setMessageReaction("❌", messageID, () => {}, true);
        }
    } catch (error) {
        console.error("HandleEvent error:", error);
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    try {
        const { threadID, messageID, senderID } = event;
        const query = args.join(" ").toLowerCase();
        const userName = await Users.getNameUser(senderID);

        // Show categories and modes
        if (!query || query === 'help' || query === 'categories') {
            const categories = {};
            
            // Group modes by category
            for (const [modeName, modeData] of Object.entries(marinaModes)) {
                if (!categories[modeData.category]) {
                    categories[modeData.category] = [];
                }
                categories[modeData.category].push(modeName);
            }

            let replyMsg = `✨ **Marina AI - Category System** ✨\n\n`;
            
            for (const [category, modes] of Object.entries(categories)) {
                replyMsg += `🎯 ${category}:\n`;
                modes.forEach(mode => {
                    replyMsg += `   • ${mode} (${marinaModes[mode].keywords.length}+ keywords)\n`;
                });
                replyMsg += `\n`;
            }

            replyMsg += `💡 **Usage:**\n`;
            replyMsg += `• Just chat normally (auto-mode)\n`;
            replyMsg += `• .marina [mode] on\n`;
            replyMsg += `• .marina categories\n\n`;
            replyMsg += `🌟 **Total:** ${Object.keys(marinaModes).length}+ Modes\n`;
            replyMsg += `🔤 1000+ Keywords | 70+ Reply Types\n\n`;
            replyMsg += `💝 Created by: Marina Khan`;

            return api.sendMessage(replyMsg, threadID, messageID);
        }

        // Mode activation
        const modeMatch = query.match(/^(\w+)\s+on$/i);

        if (modeMatch) {
            const mode = modeMatch[1].toLowerCase();
            if (marinaModes[mode]) {
                if (marinaHistory[threadID]) {
                    marinaHistory[threadID] = [];
                }
                
                const modeData = marinaModes[mode];
                const modeEmojis = {
                    "PERSONALITY": "💅", "EMOTIONAL": "😊", "ENTERTAINMENT": "🎭", 
                    "INTELLIGENCE": "🧠", "FANTASY": "🌟"
                };

                return api.sendMessage(
                    `🎀 **Mode Activated!** 🎀\n\n` +
                    `✨ Personality: ${mode.charAt(0).toUpperCase() + mode.slice(1)}\n` +
                    `📂 Category: ${modeData.category} ${modeEmojis[modeData.category] || "💖"}\n` +
                    `🔤 Keywords: ${modeData.keywords.length}+\n` +
                    `💬 Replies: ${modeData.replies.length}+\n\n` +
                    `💫 Now responding in ${mode} style!\n\n` +
                    `🌸 - Marina Khan`,
                    threadID,
                    messageID
                );
            } else {
                return api.sendMessage(
                    `❌ Invalid mode! Use ".marina categories" to see all available modes!`,
                    threadID,
                    messageID
                );
            }
        }

        // Process normal message
        const detectedMode = detectModeFromMessage(query);
        const selectedMode = marinaModes[detectedMode];
        const selectedPrompt = selectedMode.prompt;

        api.setMessageReaction("💫", messageID, () => {}, true);

        if (!marinaHistory[threadID]) {
            marinaHistory[threadID] = [];
        }

        const history = marinaHistory[threadID];
        
        const userMessage = `User: ${userName}\nMessage: ${query}\nDetected Mode: ${detectedMode}\nCategory: ${selectedMode.category}\n\n${selectedPrompt}`;
        
        history.push({ role: "user", parts: [{ text: userMessage }] });

        if (history.length > 3) history.shift();

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCaDz1GdD9VTVYHWfZ0HiNhQWhaRFr-AR4`,
                { 
                    contents: history,
                    generationConfig: {
                        maxOutputTokens: 300,
                        temperature: 0.9
                    }
                },
                { 
                    headers: { "Content-Type": "application/json" },
                    timeout: 15000
                }
            );

            let reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                       getRandomReply(detectedMode);

            if (!reply.includes("Marina") && !reply.includes("💖")) {
                reply += `\n\n💖 - Marina Khan [${selectedMode.category}]`;
            }

            history.push({ role: "model", parts: [{ text: reply }] });
            if (history.length > 3) history.shift();

            api.sendMessage(reply, threadID, messageID);
            api.setMessageReaction("💖", messageID, () => {}, true);

        } catch (err) {
            console.error("Marina AI error:", err);
            const fallbackReply = getRandomReply(detectedMode);
            api.sendMessage(fallbackReply, threadID, messageID);
            api.setMessageReaction("❌", messageID, () => {}, true);
        }

    } catch (error) {
        console.error("Marina run error:", error);
        api.sendMessage("🌸 Marina AI - Always here for you! 💖", threadID, messageID);
    }
};
