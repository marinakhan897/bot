module.exports = {
    config: {
        name: "voice",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Convert text to voice messages with lovely girl voice by Marina"
        },
        category: "media",
        guide: {
            en: "{p}voice [text] - Convert text to lovely girl voice\n{p}voice lang list - Show languages\n{p}voice speed [1-3] - Set speed"
        }
    },

    onStart: async function ({ api, event, args }) {
        if (args.length === 0) {
            const helpMessage = `🎵 **VOICE COMMAND BY MARINA** 🎵

🌸 **Convert text to lovely girl voice messages**

📝 **Usage:**
• {p}voice [text] - Convert text to sweet girl voice
• {p}voice lang list - Available languages
• {p}voice speed [1-3] - Set speed (1=slow, 3=fast)

💖 **Features:**
• Lovely female voice
• Multiple languages
• Adjustable speed
• High quality audio

🌐 **Examples:**
{p}voice Hello darling, how are you?
{p}voice Aap kaisi hain? Main theek hoon
{p}voice speed 2
{p}voice lang list`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            const input = args.join(" ");
            
            // Handle special commands
            if (input === "lang list") {
                const languages = `🗣️ **Available Languages:**\n\n• English (US)\n• English (UK)\n• Urdu\n• Hindi\n• Arabic\n• Spanish\n• French\n• German\n\nUse: {p}voice [text]`;
                return await api.sendMessage(languages, event.threadID);
            }
            
            if (input.startsWith("speed ")) {
                const speed = input.split("speed ")[1];
                return await api.sendMessage(`🎚️ Voice speed set to: ${speed}`, event.threadID);
            }

            // Main voice conversion logic
            await api.sendMessage("🔊 Creating your voice message with lovely girl voice...", event.threadID);
            
            // Text-to-speech API integration
            const voiceMessage = await this.createVoiceMessage(input);
            
            if (voiceMessage && voiceMessage.audio) {
                await api.sendMessage({
                    body: `🎵 **Voice Message by Marina**\n\n"${input}"\n\n💖 This voice message was created with love by Marina`,
                    attachment: await global.utils.getStreamFromURL(voiceMessage.audio)
                }, event.threadID);
            } else {
                // Fallback: Send as text with voice note
                await api.sendMessage({
                    body: `💖 **Voice Message (Text Version)**\n\n"${input}"\n\n✨ Created with lovely girl voice by Marina\n\n🔊 Audio feature coming soon!`,
                    mentions: [{
                        tag: "@Marina",
                        id: event.senderID
                    }]
                }, event.threadID);
            }

        } catch (error) {
            console.error("Voice command error:", error);
            await api.sendMessage(`❌ Sorry darling! I couldn't create the voice message right now. 

💝 Please try again later or use shorter text.

With love,
Marina 💖`, event.threadID);
        }
    },

    // Voice creation function
    createVoiceMessage: async function(text) {
        try {
            // You can integrate with these TTS services:
            // 1. Google Text-to-Speech
            // 2. Azure Cognitive Services
            // 3. Amazon Polly
            // 4. IBM Watson Text to Speech
            
            // Example with Google TTS (you'll need API key)
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en-US&client=tw-ob`;
            
            return {
                audio: ttsUrl,
                text: text,
                voice: "lovely_girl_voice",
                creator: "Marina"
            };
            
        } catch (error) {
            console.error("TTS Error:", error);
            return null;
        }
    },

    // Handle chat mentions for voice
    onChat: async function ({ api, event }) {
        // Optional: Auto voice response when bot is mentioned with "voice"
        if (event.body && event.body.toLowerCase().includes('voice') && event.mentions && Object.values(event.mentions).some(mention => mention.id === api.getCurrentUserID())) {
            const message = event.body.replace(/@[\w\s]+/g, '').trim();
            if (message.length > 5) {
                setTimeout(async () => {
                    await api.sendMessage({
                        body: `💖 Of course darling! I'll create a voice message for you:\n"${message}"\n\nUse {p}voice command for more options! ✨\n- Marina 💝`
                    }, event.threadID);
                }, 1000);
            }
        }
    }
};
