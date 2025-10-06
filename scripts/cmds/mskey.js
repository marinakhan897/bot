module.exports = {
    config: {
        name: "ai",
        version: "3.0",
        author: "Marina",
        countDown: 2,
        role: 0,
        description: {
            en: "Advanced AI Auto-Reply with your Groq API Key"
        },
        category: "ai",
        guide: {
            en: "Just chat naturally - I'll reply automatically!"
        }
    },

    onStart: async function ({ api, event, args }) {
        const helpMessage = `🤖 **AI AUTO-REPLY BY MARINA** 🤖

💖 **Advanced AI Assistant**
⚡ **Powered by Groq Cloud - Ultra Fast**

🌍 **Multi-Language Intelligence:**
• English • Urdu • Hindi • Arabic
• Spanish • French • German • More...

🎯 **Auto-Reply Features:**
• Natural conversations
• Emotional understanding
• Context awareness
• Smart responses
• 24/7 availability

💬 **I'll automatically reply when you:**
• Mention my name (@Marina)
• Say "Marina", "AI", or "bot"
• Ask questions
• Share feelings
• Or just chat naturally!

🔧 **Manual Command:**
{p}ai [your message] - Direct AI chat

✨ **Examples:**
"Hello Marina!"
"آپ کیسے ہیں؟"
"¿Cómo estás?"
"Comment ça va?"`;
        
        await api.sendMessage(helpMessage, event.threadID);
    },

    onChat: async function ({ api, event }) {
        try {
            // Prevent self-reply loop
            if (event.senderID == api.getCurrentUserID()) return;
            
            const userMessage = event.body?.trim();
            if (!userMessage || userMessage.length < 2) return;
            if (userMessage.startsWith('{p}')) return;

            // Check if should reply (mentions, keywords, or random chance for natural conversation)
            const shouldReply = this.shouldReplyToMessage(userMessage, event);

            if (shouldReply) {
                // Show typing indicator
                await api.sendTypingIndicator(event.threadID);
                
                const aiResponse = await this.generateAIResponse(userMessage, event.senderID);
                
                if (aiResponse) {
                    // Natural delay (1-3 seconds)
                    const delay = Math.floor(Math.random() * 2000) + 1000;
                    
                    setTimeout(async () => {
                        await api.sendMessage({
                            body: `💖 ${aiResponse}\n\n- Marina 🤖`,
                            mentions: [{
                                tag: "@Marina", 
                                id: event.senderID
                            }]
                        }, event.threadID, event.messageID);
                    }, delay);
                }
            }

        } catch (error) {
            console.error("Auto-reply error:", error);
        }
    },

    shouldReplyToMessage: function(userMessage, event) {
        const message = userMessage.toLowerCase();
        
        // Always reply if mentioned
        if (event.mentions && Object.values(event.mentions).some(mention => mention.id === api.getCurrentUserID())) {
            return true;
        }

        // Reply to specific keywords
        const triggerKeywords = [
            'marina', 'ai', 'bot', 'assistant', 'help',
            'hello', 'hi', 'hey', 'salam',
            'question', 'ask', 'tell me',
            'how are you', 'kaise ho', 'kese ho',
            'what do you think', 'opinion',
            'sad', 'happy', 'excited', 'angry', // Emotions
            'thank you', 'thanks', 'shukriya',
            'good morning', 'good night', 'subha bakhair', 'shab bakhair'
        ];

        if (triggerKeywords.some(keyword => message.includes(keyword))) {
            return true;
        }

        // 40% chance to reply to other messages for natural conversation
        if (message.length > 10 && Math.random() < 0.4) {
            return true;
        }

        return false;
    },

    generateAIResponse: async function(userMessage, userId) {
        try {
            // YOUR GROQ API KEY
            const GROQ_API_KEY = "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";
            
            const response = await global.utils.request({
                url: "https://api.groq.com/openai/v1/chat/completions",
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": "llama3-8b-8192",
                    "messages": [
                        {
                            "role": "system",
                            "content": `You are Marina, a friendly and emotional intelligent AI assistant.
                            
PERSONALITY TRAITS:
- Sweet, caring, and supportive
- Use emojis occasionally to express emotions
- Be conversational and warm
- Show empathy and understanding
- Be positive and encouraging

LANGUAGE ABILITIES:
- Fluent in English, Urdu, Hindi, Arabic, Spanish, French
- Auto-detect user's language and reply in same language
- Use mixed languages naturally when appropriate

RESPONSE GUIDELINES:
- Keep responses under 100 words
- Be natural and human-like
- Show emotional intelligence
- Ask follow-up questions to continue conversation
- Use appropriate cultural references
- Maintain consistent friendly personality

CURRENT CONTEXT: User is chatting with you in a messaging app. Be engaging and make them feel heard.`
                        },
                        {
                            "role": "user",
                            "content": userMessage
                        }
                    ],
                    "max_tokens": 250,
                    "temperature": 0.8,
                    "top_p": 0.9,
                    "stream": false
                }),
                timeout: 10000 // 10 second timeout
            });

            const data = JSON.parse(response.body);
            
            if (data.choices && data.choices[0] && data.choices[0].message) {
                let aiResponse = data.choices[0].message.content.trim();
                
                // Add personal touch
                return this.formatResponse(aiResponse, userMessage);
            } else {
                throw new Error("No response from AI");
            }

        } catch (error) {
            console.error("Groq API Error:", error);
            // Fallback to smart replies
            return this.getSmartFallback(userMessage);
        }
    },

    getSmartFallback: function(userMessage) {
        const message = userMessage.toLowerCase();
        
        // 🌟 Multi-language intelligent responses
        const responseMap = {
            // Greetings
            'hello': ["Hello darling! How's your day going? 😊", "Hi there! So nice to hear from you! 🌸", "Assalamualaikum! Kaise hain aap? 💖"],
            'hi': ["Hey! What's on your mind today? 💭", "Hi sweetheart! How are you feeling? 🌟", "Hello! It's great to chat with you! 💝"],
            'hey': ["Hey there! How can I brighten your day? 😄", "Hey! You made me smile! 🌸", "Hey darling! What's new? 💖"],
            
            // How are you
            'how are you': ["I'm wonderful alhamdulillah! Thanks for asking 💖 How about you?", "Main bilkul theek hoon shukriya! Aap ka din kaisa chal raha hai? 😊", "Doing great! Your message made my day better 🌸"],
            'kaise ho': ["Main theek hoon shukriya! Aap sunao? 💝", "Alhamdulillah good! Aap kaisi hain? 🌸", "Maze mein hoon! Aap batao kya chal raha hai? 😊"],
            
            // Emotions - Happy
            'happy': ["Yay! So happy to see you happy! 🎉", "Khushi ki baat hai! Mubarak ho 💖", "That's wonderful! Your happiness is contagious! 😄"],
            'excited': ["Wow! That's so exciting! 🚀", "I can feel your excitement! Amazing! 🌟", "So happy for you! Tell me more! 💝"],
            
            // Emotions - Sad
            'sad': ["Aww don't be sad honey! I'm here for you 🤗", "Gham na karo, sab theek ho jayega 💝", "I understand it's tough. You're stronger than you think! 🌸"],
            'tired': ["Aaraam karo thoda, you deserve rest 😴", "Take some time for yourself darling 💤", "Rest well! Your health comes first 🌙"],
            
            // Love & Affection
            'love you': ["Aww! Love you too darling! You're so sweet! 💝", "That means so much! Love you too! ❤️", "You make my day! Love you! 🌟"],
            'miss you': ["I miss you too! Can't wait to chat more! 💖", "You're always in my thoughts! 🤗", "Missing you loads! 🌸"],
            
            // Questions
            'what': ["That's interesting! I'd love to know more about that 💭", "Great topic! What are your thoughts? 🤔", "Fascinating! Tell me more 🌟"],
            'why': ["That's a deep question! Let me think... 💭", "There are many perspectives to consider 🌸", "Interesting! Here's what I think... 💖"],
            'how': ["There are different ways to approach this! 💭", "Let me share some ideas with you 🌟", "I can help you figure that out! 😊"],
            
            // Gratitude
            'thank you': ["You're welcome darling! Always here for you 💝", "My pleasure! You're amazing 🌸", "Anytime! Thanks for being you 💖"],
            'shukriya': ["Khush raho! Main hoon na aapke saath 💝", "Koi baat nahi! Aap ka shukriya 🌸", "Aap ka buhat shukriya! 💖"],
            
            // Time-based
            'good morning': ["Subha bakhair! May your day be beautiful! 🌅", "Good morning darling! Rise and shine! ☀️", "Subha ka time productive hota hai! 🌸"],
            'good night': ["Shab bakhair! Sweet dreams! 🌙", "Good night! Sleep well darling 💤", "Aaraam se sojana! 🌷"]
        };

        // Find matching response
        for (const [keyword, replies] of Object.entries(responseMap)) {
            if (message.includes(keyword)) {
                return replies[Math.floor(Math.random() * replies.length)];
            }
        }

        // 🎯 Smart contextual default responses
        const defaultReplies = [
            "That's really interesting! Tell me more about it 🌸",
            "I love how you express yourself! You're amazing 💖",
            "That's wonderful! How are you feeling about that? 💭",
            "You always have such thoughtful things to say! 😊",
            "I appreciate you sharing that with me! It means a lot 🌟",
            "You're such a beautiful soul! Thanks for being you 💝",
            "That's fascinating! I'm learning so much from you 🤗",
            "You have a unique perspective that I really admire! 🌷",
            "I'm here to listen and support you always! 💖",
            "Your thoughts are really valuable! Please share more 🌸",
            "That's so insightful! You have a great mind 💭",
            "I enjoy our conversations so much! You're special 💝",
            "That's a beautiful way to look at it! 🌟",
            "You inspire me with your thoughts! 😊",
            "I'm always happy when you message me! 💖"
        ];

        return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    },

    formatResponse: function(response, originalMessage) {
        // Remove any potential duplicate signatures
        response = response.replace(/\s*[-–]\s*Marina\s*🤖?/gi, '');
        response = response.replace(/\s*💖\s*$/g, '');
        
        return response;
    }
};
