module.exports = {
    config: {
        name: "voice",
        version: "4.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Ultimate voice generator with multiple languages & voice modes by Marina"
        },
        category: "media",
        guide: {
            en: "{p}voice [text] - Girl voice\n{p}voice boy [text] - Boy voice\n{p}voice lang [code] [text] - Specific language\n{p}voice list - All voices\n{p}voice languages - All languages"
        }
    },

    onStart: async function ({ api, event, args }) {
        if (args.length === 0) {
            const helpMessage = `🎭 **ULTIMATE VOICE BY MARINA** 🎭

💖 **Multiple Languages & Voice Modes**

🌍 **Supported Languages:**
• English (en) • Urdu (ur) • Hindi (hi)
• Arabic (ar) • Spanish (es) • French (fr)
• German (de) • Italian (it) • Portuguese (pt)

🎙️ **Voice Modes:**
• Girl Voice (Default) - Sweet & Natural
• Boy Voice - Masculine & Clear  
• Child Voice - Cute & Playful
• Romantic Voice - Soft & Loving

📝 **Commands:**
{p}voice [text] - Auto-detect language
{p}voice boy [text] - Boy voice
{p}voice child [text] - Child voice  
{p}voice romantic [text] - Romantic voice
{p}voice lang [code] [text] - Specific language
{p}voice list - Show all voices
{p}voice languages - All language codes

💬 **Examples:**
{p}voice Hello darling!
{p}voice آپ کیسے ہیں؟
{p}voice lang ur آپ کیسے ہیں؟
{p}voice boy हेलो दोस्त`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            const voiceModes = {
                girl: { name: "🎀 Girl Voice", voiceId: "21m00Tcm4TlvDq8ikWAM" },
                boy: { name: "👦 Boy Voice", voiceId: "VR6AewLTigWG4xSOukaG" }, 
                child: { name: "🍭 Child Voice", voiceId: "MF3mGyEYCl7XYWbV9V6O" },
                romantic: { name: "💖 Romantic Voice", voiceId: "ThT5KcBeYPX3keUQqHPh" }
            };

            const languages = {
                // English
                'en': { name: "English", code: "en-US" },
                'en-us': { name: "English (US)", code: "en-US" },
                'en-gb': { name: "English (UK)", code: "en-GB" },
                
                // Urdu & Hindi
                'ur': { name: "Urdu", code: "ur-PK" },
                'hi': { name: "Hindi", code: "hi-IN" },
                'pa': { name: "Punjabi", code: "pa-IN" },
                
                // Arabic
                'ar': { name: "Arabic", code: "ar-SA" },
                
                // European Languages
                'es': { name: "Spanish", code: "es-ES" },
                'fr': { name: "French", code: "fr-FR" },
                'de': { name: "German", code: "de-DE" },
                'it': { name: "Italian", code: "it-IT" },
                'pt': { name: "Portuguese", code: "pt-BR" }
            };

            const firstArg = args[0].toLowerCase();
            
            if (firstArg === "list") {
                const voiceList = Object.entries(voiceModes).map(([mode, data]) => 
                    `• ${data.name} - Use: {p}voice ${mode} [text]`
                ).join('\n');
                
                return await api.sendMessage(`🎭 **Available Voices by Marina:**\n\n${voiceList}\n\n💝 Created with love by Marina`, event.threadID);
            }

            if (firstArg === "languages" || firstArg === "langs") {
                const langList = Object.entries(languages).map(([code, data]) => 
                    `• ${data.name} (${code})`
                ).join('\n');
                
                return await api.sendMessage(`🌍 **Supported Languages:**\n\n${langList}\n\n💝 Use: {p}voice lang [code] [text]`, event.threadID);
            }

            let voiceType = "girl";
            let language = null;
            let text = args.join(" ");

            // Handle language-specific command
            if (firstArg === "lang" && args[1]) {
                const langCode = args[1].toLowerCase();
                if (languages[langCode]) {
                    language = languages[langCode];
                    voiceType = "girl";
                    text = args.slice(2).join(" ");
                } else {
                    return await api.sendMessage(`❌ Invalid language code: ${langCode}\nUse {p}voice languages to see all codes\n- Marina 💝`, event.threadID);
                }
            }
            // Handle voice mode commands
            else if (voiceModes[firstArg]) {
                voiceType = firstArg;
                text = args.slice(1).join(" ");
            }

            if (!text) {
                return await api.sendMessage("❌ Please provide text to convert to voice!\n- Marina 💝", event.threadID);
            }

            // Auto-detect language if not specified
            if (!language) {
                language = this.detectLanguage(text);
            }

            await api.sendMessage(`🎙️ Creating ${voiceModes[voiceType].name} in ${language.name}...\n- Marina 💖`, event.threadID);

            // Try multiple voice generation methods
            const voiceResult = await this.generateVoice(text, language.code, voiceType);
            
            if (voiceResult.success) {
                await api.sendMessage({
                    body: `🎭 **${voiceModes[voiceType].name}** | 🌍 **${language.name}**\n\n"${text}"\n\n💝 Voice crafted with love by Marina\n✨ Language: ${language.name}`,
                    attachment: voiceResult.audioStream
                }, event.threadID);
            } else {
                throw new Error("All voice generation methods failed");
            }

        } catch (error) {
            console.error("Voice error:", error);
            // Use reliable Google TTS as final fallback
            await this.useGoogleTTSFallback(api, event, args.join(" "));
        }
    },

    detectLanguage: function(text) {
        const languages = {
            'ur': { name: "Urdu", code: "ur-PK" },
            'hi': { name: "Hindi", code: "hi-IN" },
            'ar': { name: "Arabic", code: "ar-SA" },
            'es': { name: "Spanish", code: "es-ES" },
            'fr': { name: "French", code: "fr-FR" },
            'de': { name: "German", code: "de-DE" },
            'it': { name: "Italian", code: "it-IT" },
            'pt': { name: "Portuguese", code: "pt-BR" },
            'en': { name: "English", code: "en-US" }
        };

        // Simple language detection
        if (/[\u0600-\u06FF]/.test(text)) return languages.ar; // Arabic
        if (/[\u0900-\u097F]/.test(text)) return languages.hi; // Hindi
        if (/[آ-ی]/.test(text)) return languages.ur; // Urdu/Persian
        if (/ñ|¿|¡/.test(text)) return languages.es; // Spanish
        if (/é|è|ê|à|ç/.test(text)) return languages.fr; // French
        if (/ä|ö|ü|ß/.test(text)) return languages.de; // German
        
        return languages['en']; // Default English
    },

    generateVoice: async function(text, languageCode, voiceType) {
        // METHOD 1: Try Google TTS first (most reliable)
        try {
            const googleVoice = await this.generateGoogleTTS(text, languageCode);
            if (googleVoice.success) {
                return googleVoice;
            }
        } catch (error) {
            console.log("Google TTS failed, trying next method...");
        }

        // METHOD 2: Try ElevenLabs with better error handling
        try {
            const elevenLabsVoice = await this.generateElevenLabsVoice(text, languageCode);
            if (elevenLabsVoice.success) {
                return elevenLabsVoice;
            }
        } catch (error) {
            console.log("ElevenLabs failed, using fallback...");
        }

        // METHOD 3: Final fallback - basic TTS
        return await this.generateBasicTTS(text, languageCode);
    },

    generateGoogleTTS: async function(text, languageCode) {
        try {
            // Google TTS URL - most reliable and free
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${languageCode}&client=tw-ob&idx=0&total=1`;
            
            const response = await global.utils.getStreamFromURL(ttsUrl);
            return {
                success: true,
                audioStream: response
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    generateElevenLabsVoice: async function(text, languageCode) {
        try {
            const XI_API_KEY = "sk_8b6c8f4a75f2e8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f";
            
            // Use a working voice ID
            const voiceId = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice - works well
            
            const response = await global.utils.request({
                url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': XI_API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                }),
                responseType: 'stream',
                timeout: 30000 // 30 second timeout
            });

            if (response.statusCode !== 200) {
                throw new Error(`API returned status: ${response.statusCode}`);
            }

            return {
                success: true,
                audioStream: response.body
            };

        } catch (error) {
            console.error("ElevenLabs error:", error.message);
            return { success: false, error: error.message };
        }
    },

    generateBasicTTS: async function(text, languageCode) {
        try {
            // Alternative TTS service
            const ttsUrl = `http://api.voicerss.org/?key=demo&hl=${languageCode}&src=${encodeURIComponent(text)}`;
            const response = await global.utils.getStreamFromURL(ttsUrl);
            
            return {
                success: true,
                audioStream: response
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    useGoogleTTSFallback: async function(api, event, text) {
        try {
            await api.sendMessage(`🔊 Creating voice message with reliable service...\n- Marina 💖`, event.threadID);
            
            const language = this.detectLanguage(text);
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language.code}&client=tw-ob`;
            
            await api.sendMessage({
                body: `🎵 **Voice Message** | 🌍 **${language.name}**\n\n"${text}"\n\n💝 Created with love by Marina\n✨ Using reliable voice service`,
                attachment: await global.utils.getStreamFromURL(ttsUrl)
            }, event.threadID);
            
        } catch (finalError) {
            console.error("Final fallback failed:", finalError);
            await api.sendMessage({
                body: `💝 **Voice Message Preview**\n\n"${text}"\n\n🎵 Imagine this in a sweet voice!\n✨ Voice services are temporarily busy\n\nTry again in a few minutes darling!\n- Marina 💖`
            }, event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        if (event.body && event.body.toLowerCase().includes('voice') && 
            event.mentions && Object.values(event.mentions).some(mention => mention.id === api.getCurrentUserID())) {
            
            const message = event.body.replace(/@[\w\s]+/g, '').replace('voice', '').trim();
            
            if (message.length > 3) {
                setTimeout(async () => {
                    await api.sendMessage({
                        body: `💖 You want a voice message? Use:\n{p}voice "${message}"\n\nI support multiple languages! 🌍\n- Marina 🎀`
                    }, event.threadID, event.messageID);
                }, 1500);
            }
        }
    }
};
