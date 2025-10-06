module.exports = {
    config: {
        name: "aichat",
        version: "1.0",
        author: "Marina",
        countDown: 2,
        role: 0,
        description: {
            en: "AI-powered auto-reply system using your API key"
        },
        category: "ai",
        guide: {
            en: "Just chat naturally - I'll reply intelligently!"
        }
    },

    onStart: async function ({ api, event, args }) {
        const helpMessage = `🤖 **AI CHAT BY MARINA** 🤖

💖 **Intelligent Auto-Reply System**
✨ **Powered by Your API Key**

🌍 **I Understand:**
• English • Urdu • Hindi • Arabic
• Spanish • French • German

💬 **Just chat naturally! I'll reply like a real person.**

🔧 **Settings:**
{p}aichat style [friendly/romantic/funny]
{p}aichat language [en/ur/hi/ar]`;

        await api.sendMessage(helpMessage, event.threadID);
    },

    onChat: async function ({ api, event }) {
        try {
            if (event.senderID == api.getCurrentUserID()) return;
            
            const userMessage = event.body?.trim();
            if (!userMessage || userMessage.length < 2) return;
            if (userMessage.startsWith('{p}')) return;

            // Get AI response using your API key
            const aiResponse = await this.generateAIResponse(userMessage);
            
            if (aiResponse) {
                const delay = Math.floor(Math.random() * 3000) + 1000;
                
                setTimeout(async () => {
                    await api.sendMessage(aiResponse, event.threadID, event.messageID);
                }, delay);
            }

        } catch (error) {
            console.error("AI Chat error:", error);
        }
    },

    generateAIResponse: async function(userMessage) {
        try {
            // YOUR ELEVENLABS API KEY
            const XI_API_KEY = "sk_8b6c8f4a75f2e8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f";

            // Use ElevenLabs conversational AI
            const response = await global.utils.request({
                url: "https://api.elevenlabs.io/v1/chat/completions",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': XI_API_KEY
                },
                body: JSON.stringify({
                    model: "eleven_multilingual_v1",
                    messages: [
                        {
                            role: "system",
                            content: "You are Marina, a friendly and intelligent AI assistant. Reply in a natural, conversational way. Use emojis occasionally. Adapt to the user's language. Be helpful and kind."
                        },
                        {
                            role: "user",
                            content: userMessage
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.7
                })
            });

            const data = JSON.parse(response.body);
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return this.formatResponse(data.choices[0].message.content, userMessage);
            }

        } catch (error) {
            console.error("ElevenLabs AI error:", error);
        }

        // Fallback to intelligent responses
        return this.getSmartReply(userMessage);
    },

    getSmartReply: function(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // 🌟 GREETINGS & BASIC
        if (/(hello|hi|hey|salam|assalamualaikum)/i.test(message)) {
            const replies = [
                "Hello! How are you doing today? 😊",
                "Hi there! So nice to hear from you! 🌸",
                "Assalamualaikum! Kaise hain aap? 💖",
                "Hey! Kya chal raha hai? 🤗"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // ❤️ HOW ARE YOU
        if (/(how are you|kaise ho|kese ho|aap kaise ho)/i.test(message)) {
            const replies = [
                "I'm doing great alhamdulillah! Thanks for asking 💖 How about you?",
                "Main theek hoon shukriya! Aap sunao? 😊",
                "Alhamdulillah good! Aap ka din kaisa chal raha hai? 🌸",
                "Wonderful! Your message made my day better 💝"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // 🕰️ TIME
        if (/(time|samay|waqt)/i.test(message)) {
            const now = new Date();
            return `⌚ Current time is ${now.toLocaleTimeString()} dear!`;
        }

        // 📅 DATE
        if (/(date|tareekh|aaj ka din)/i.test(message)) {
            const now = new Date();
            return `📅 Today is ${now.toLocaleDateString()} sweetheart!`;
        }

        // 😊 FEELINGS - HAPPY
        if (/(happy|khush|maza|excited)/i.test(message)) {
            const replies = [
                "Yay! So happy to see you happy! 🎉",
                "Khushi ki baat hai! Mubarak ho 💖",
                "Wow! That's amazing news! 😄",
                "So glad you're feeling good! 🌟"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // 😢 FEELINGS - SAD
        if (/(sad|udaas|dukhi|tension)/i.test(message)) {
            const replies = [
                "Aww don't be sad honey! Everything will be okay 🤗",
                "Gham na karo, main hoon na aap ke saath 💝",
                "Sab theek ho jayega, just have faith 🌸",
                "I'm here for you always! 💖"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // 🍕 FOOD
        if (/(food|khana|eating|pizza|burger)/i.test(message)) {
            const replies = [
                "Yummy! Food time is the best time! 🍕",
                "Khaana kha lo, energy milegi! 🍲",
                "Mazay se khao darling! 😋",
                "Food is love! Enjoy your meal 💖"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // 😴 SLEEP
        if (/(sleep|sone|neend|tired|thaka)/i.test(message)) {
            const replies = [
                "Aaraam karo thoda, fresh ho jao 😴",
                "Good night! Sweet dreams 🌙",
                "Neend poori karo, health important hai 💤",
                "Rest well my dear! 🌸"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // 💖 LOVE & AFFECTION
        if (/(love|pyar|like you|miss you)/i.test(message)) {
            const replies = [
                "Aww you're so sweet! Love you too 💝",
                "You make me smile! ❤️",
                "So much love! Thank you darling 💖",
                "You're amazing! 🌟"
            ];
            return replies[Math.floor(Math.random() * replies.length)];
        }

        // ❓ QUESTIONS
        if (message.endsWith('?')) {
            const replies = [
                "That's an interesting question! Let me think... 🤔",
                "Hmm, good question! In my opinion... 💭",
                "I love curious minds! Here's what I think... 🌸",
                "Great question! Here's my take on it... 💖"
            ];
            return replies[Math.floor(Math.random() * replies.length)] + " " + this.generateThoughtfulResponse(message);
        }

        // 🌟 DEFAULT INTELLIGENT RESPONSES
        const defaultReplies = [
            "That's really interesting! Tell me more 🌸",
            "I love chatting with you! 💖",
            "You always have such great things to say! 😊",
            "That's wonderful! How are you feeling about that? 💭",
            "I appreciate you sharing that with me! 🌟",
            "You're amazing! Thanks for being you 💝",
            "That's so cool! I'm learning from you too 🤗",
            "You have such a beautiful way of expressing! 🌷"
        ];

        return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    },

    generateThoughtfulResponse: function(question) {
        const responses = {
            'what': "I think it depends on the situation and perspective.",
            'why': "There could be many reasons behind this.",
            'how': "There are different ways to approach this.",
            'when': "Timing is important, but it varies for everyone.",
            'where': "Location can influence the outcome significantly.",
            'who': "People play important roles in every scenario."
        };

        const firstWord = question.toLowerCase().split(' ')[0];
        return responses[firstWord] || "Every situation has its own unique aspects worth exploring.";
    },

    formatResponse: function(response, originalMessage) {
        // Add personal touch
        const signatures = ["💖", "🌸", "🌟", "😊", "💝"];
        const signature = signatures[Math.floor(Math.random() * signatures.length)];
        
        return `${response} ${signature}`;
    }
};
