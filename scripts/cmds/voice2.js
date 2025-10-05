module.exports.config = {
    name: "girlvoice",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "Sweet female voice messages",
    commandCategory: "media",
    usages: "[text]",
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
        
        if (!args[0]) {
            return api.sendMessage("🌸 Usage: !girlvoice [text]\n\nI'll speak your text in a sweet female voice!", event.threadID);
        }
        
        const text = args.join(" ");
        const filePath = __dirname + '/cache/girl_voice.mp3';
        
        // Sweet endings with Marina's name
        const sweetEndings = [
            ` ${text}. Sending love from Marina!`,
            ` ${text}. Have a wonderful day! This is Marina.`,
            ` ${text}. Take care everyone! Love, Marina.`,
            ` ${text}. Stay blessed! Yours truly, Marina.`,
            ` ${text}. Keep smiling! Marina here.`
        ];
        
        const randomEnding = sweetEndings[Math.floor(Math.random() * sweetEndings.length)];
        
        // Create female voice
        const voice = new gtts(randomEnding, 'en');
        voice.save(filePath, function (err, result) {
            if (err) {
                console.error(err);
                return api.sendMessage("❌ Error creating voice message!", event.threadID);
            }
            
            // Send voice message
            api.sendMessage({
                body: `🌸 Girl Voice by Marina:\n"${text}"\n\n💝 With love from Marina Khan`,
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
