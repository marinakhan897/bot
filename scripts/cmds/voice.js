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

💖 **Multiple Languages & Voice Modes - 100% Real**

🌍 **Supported Languages:**
• English (en) • Urdu (ur) • Hindi (hi)
• Arabic (ar) • Spanish (es) • French (fr)
• German (de) • Italian (it) • Portuguese (pt)
• Turkish (tr) • Russian (ru) • Japanese (ja)
• Korean (ko) • Chinese (zh) • Punjabi (pa)

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
{p}voice آپ کیسے ہیں؟ - Auto Urdu
{p}voice lang ur آپ کیسے ہیں؟ - Force Urdu
{p}voice boy हेलो दोस्त - Auto Hindi
{p}voice romantic Te amo mucho - Auto Spanish
{p}voice languages`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            const voiceModes = {
                girl: { name: "🎀 Girl Voice", voiceId: "EXAVITQu4vr4xnSDxMAL" },
                boy: { name: "👦 Boy Voice", voiceId: "VR6AewLTigWG4xSOukaG" }, 
                child: { name: "🍭 Child Voice", voiceId: "MF3mGyEYCl7XYWbV9V6O" },
                romantic: { name: "💖 Romantic Voice", voiceId: "ThT5KcBeYPX3keUQqHPh" }
            };

            const languages = {
                // English
                'en': { name: "English", voiceId: "EXAVITQu4vr4xnSDxMAL", code: "en-US" },
                'en-us': { name: "English (US)", voiceId: "EXAVITQu4vr4xnSDxMAL", code: "en-US" },
                'en-gb': { name: "English (UK)", voiceId: "LcfcDJNUP1GQjkzn1xUU", code: "en-GB" },
                
                // Urdu & Hindi
                'ur': { name: "Urdu", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ur-PK" },
                'hi': { name: "Hindi", voiceId: "XB0fDUnXU5powFXDhCwa", code: "hi-IN" },
                'pa': { name: "Punjabi", voiceId: "XB0fDUnXU5powFXDhCwa", code: "pa-IN" },
                
                // Arabic
                'ar': { name: "Arabic", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ar-SA" },
                'ar-sa': { name: "Arabic (Saudi)", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ar-SA" },
                'ar-eg': { name: "Arabic (Egypt)", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ar-EG" },
                
                // European Languages
                'es': { name: "Spanish", voiceId: "D38z5RcWu1voky8WS1ja", code: "es-ES" },
                'fr': { name: "French", voiceId: "VR6AewLTigWG4xSOukaG", code: "fr-FR" },
                'de': { name: "German", voiceId: "VR6AewLTigWG4xSOukaG", code: "de-DE" },
                'it': { name: "Italian", voiceId: "VR6AewLTigWG4xSOukaG", code: "it-IT" },
                'pt': { name: "Portuguese", voiceId: "VR6AewLTigWG4xSOukaG", code: "pt-BR" },
                
                // Asian Languages
                'tr': { name: "Turkish", voiceId: "XB0fDUnXU5powFXDhCwa", code: "tr-TR" },
                'ru': { name: "Russian", voiceId: "VR6AewLTigWG4xSOukaG", code: "ru-RU" },
                'ja': { name: "Japanese", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ja-JP" },
                'ko': { name: "Korean", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ko-KR" },
                'zh': { name: "Chinese", voiceId: "XB0fDUnXU5powFXDhCwa", code: "zh-CN" },
                'zh-cn': { name: "Chinese (Simplified)", voiceId: "XB0fDUnXU5powFXDhCwa", code: "zh-CN" }
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
                    voiceType = "girl"; // Default voice for language mode
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

            const voiceResult = await this.generateElevenLabsVoice(text, voiceModes[voiceType].voiceId, language.code);
            
            if (voiceResult.success) {
                await api.sendMessage({
                    body: `🎭 **${voiceModes[voiceType].name}** | 🌍 **${language.name}**\n\n"${text}"\n\n💝 Voice crafted with love by Marina\n✨ Language: ${language.name}`,
                    attachment: voiceResult.audioStream
                }, event.threadID);
            } else {
                await this.fallbackVoice(api, event, text, voiceType, language);
            }

        } catch (error) {
            console.error("Voice error:", error);
            await api.sendMessage(`💔 Sorry! Voice service is busy right now.\n\nTry again in a moment darling!\n- Marina 💝`, event.threadID);
        }
    },

    detectLanguage: function(text) {
        const languages = {
            'ur': { name: "Urdu", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ur-PK" },
            'hi': { name: "Hindi", voiceId: "XB0fDUnXU5powFXDhCwa", code: "hi-IN" },
            'ar': { name: "Arabic", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ar-SA" },
            'es': { name: "Spanish", voiceId: "D38z5RcWu1voky8WS1ja", code: "es-ES" },
            'fr': { name: "French", voiceId: "VR6AewLTigWG4xSOukaG", code: "fr-FR" },
            'de': { name: "German", voiceId: "VR6AewLTigWG4xSOukaG", code: "de-DE" },
            'it': { name: "Italian", voiceId: "VR6AewLTigWG4xSOukaG", code: "it-IT" },
            'pt': { name: "Portuguese", voiceId: "VR6AewLTigWG4xSOukaG", code: "pt-BR" },
            'tr': { name: "Turkish", voiceId: "XB0fDUnXU5powFXDhCwa", code: "tr-TR" },
            'ru': { name: "Russian", voiceId: "VR6AewLTigWG4xSOukaG", code: "ru-RU" },
            'ja': { name: "Japanese", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ja-JP" },
            'ko': { name: "Korean", voiceId: "XB0fDUnXU5powFXDhCwa", code: "ko-KR" },
            'zh': { name: "Chinese", voiceId: "XB0fDUnXU5powFXDhCwa", code: "zh-CN" }
        };

        // Language detection logic
        if (/[\u0600-\u06FF]/.test(text)) return languages.ar; // Arabic
        if (/[\u0900-\u097F]/.test(text)) return languages.hi; // Hindi
        if (/[\u0A00-\u0A7F]/.test(text)) return languages.pa; // Punjabi
        if (/[\u4e00-\u9fff]/.test(text)) return languages.zh; // Chinese
        if (/[\u3040-\u309F]/.test(text)) return languages.ja; // Japanese
        if (/[\uAC00-\uD7AF]/.test(text)) return languages.ko; // Korean
        if (/[آ-ی]/.test(text)) return languages.ur; // Urdu/Persian
        
        // European languages detection
        if (/ñ|¿|¡/.test(text)) return languages.es; // Spanish
        if (/é|è|ê|à|ç/.test(text)) return languages.fr; // French
        if (/ä|ö|ü|ß/.test(text)) return languages.de; // German
        if (/à|è|é|ì|ò|ù/.test(text)) return languages.it; // Italian
        if (/ã|õ|ç/.test(text)) return languages.pt; // Portuguese
        
        return languages['en']; // Default English
    },

    generateElevenLabsVoice: async function(text, voiceId, languageCode = "en-US") {
        try {
            // YOUR ELEVENLABS API KEY
            const XI_API_KEY = "sk_8b6c8f4a75f2e8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f";
            
            const response = await global.utils.request({
                url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': XI_API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_multilingual_v1", // Multilingual model
                    voice_settings: {
                        stability: 0.3,
                        similarity_boost: 0.7,
                        style: 0.5,
                        use_speaker_boost: true
                    }
                }),
                responseType: 'stream'
            });

            return {
                success: true,
                audioStream: response.body
            };

        } catch (error) {
            console.error("ElevenLabs error:", error);
            return { success: false, error: error.message };
        }
    },

    fallbackVoice: async function(api, event, text, voiceType, language) {
        try {
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${language.code}&client=tw-ob`;
            
            await api.sendMessage({
                body: `🎭 **${voiceType.toUpperCase()} VOICE** | 🌍 **${language.name}**\n\n"${text}"\n\n💝 Created by Marina\n✨ Using basic TTS service`,
                attachment: await global.utils.getStreamFromURL(ttsUrl)
            }, event.threadID);

        } catch (fallbackError) {
            await api.sendMessage({
                body: `🎭 **${voiceType.toUpperCase()} VOICE** | 🌍 **${language.name}**\n\n"${text}"\n\n💖 Voice service unavailable right now\n✨ Try again later darling!\n\nWith love,\nMarina 💝`
            }, event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        // Auto-detect voice requests in chat
        if (event.body && event.body.toLowerCase().includes('voice') && 
            (event.mentions && Object.values(event.mentions).some(mention => mention.id === api.getCurrentUserID()))) {
            
            const message = event.body.replace(/@[\w\s]+/g, '').replace('voice', '').trim();
            
            if (message.length > 3) {
                setTimeout(async () => {
                    await api.sendMessage({
                        body: `💖 You want a voice message? Use:\n{p}voice "${message}"\n\nI support 15+ languages! 🌍\n- Marina 🎀`
                    }, event.threadID, event.messageID);
                }, 1500);
            }
        }
    }
};
