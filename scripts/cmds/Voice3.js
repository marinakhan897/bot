module.exports.config = {
    name: "marinavoice",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "Female voice in multiple languages",
    commandCategory: "media",
    usages: "[lang] [text]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": "",
        "gtts": ""
    }
}

module.exports.run = async function({ api, event, args }) {
    try {
        const gtts = require('gtts');
        const fs = require('fs-extra');
        
        if (args.length < 2) {
            return api.sendMessage(`🎀 Marina Voice - Female TTS\n\nUsage: !marinavoice [lang] [text]\n\nSupported languages:\n🇺🇸 en - English\n🇪🇸 es - Spanish\n🇫🇷 fr - French\n🇩🇪 de - German\n🇮🇹 it - Italian\n🇯🇵 ja - Japanese\n🇰🇷 ko - Korean\n\nExample: !marinavoice en Hello friends`, event.threadID);
        }
        
        const lang = args[0].toLowerCase();
        const text = args.slice(1).join(" ");
        const filePath = __dirname + '/cache/marina_voice.mp3';
        
        const supportedLangs = ['en', 'es', 'fr', 'de', 'it', 'ja', 'ko'];
        
        if (!supportedLangs.includes(lang)) {
            return api.sendMessage("❌ Unsupported language! Use: en, es, fr, de, it, ja, ko", event.threadID);
        }
        
        // Language-specific endings with Marina's name
        const endings = {
            'en': ` ${text}. This is Marina, signing off!`,
            'es': ` ${text}. Esto es Marina, despidiéndose!`,
            'fr': ` ${text}. C'est Marina, qui vous dit au revoir!`,
            'de': ` ${text}. Das ist Marina, verabschiedet sich!`,
            'it': ` ${text}. Questa è Marina, che saluta!`,
            'ja': ` ${text}. マリーナでした。さようなら!`,
            'ko': ` ${text}. 마리나입니다. 안녕!`
        };
        
        const fullText = endings[lang] || endings['en'];
        
        // Create female voice
        const voice = new gtts(fullText, lang);
        voice.save(filePath, function (err, result) {
            if (err) {
                console.error(error);
                return api.sendMessage("❌ Error creating voice message!", event.threadID);
            }
            
            const langNames = {
                'en': 'English', 'es': 'Spanish', 'fr': 'French', 
                'de': 'German', 'it': 'Italian', 'ja': 'Japanese',
                'ko': 'Korean'
            };
            
            // Send voice message
            api.sendMessage({
                body: `🎀 Marina's ${langNames[lang]} Voice:\n"${text}"\n\n— Marina Khan 💫`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => {
                fs.unlinkSync(filePath);
            });
        });
        
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ Error: " + error.message, event.threadID);
    }
}
