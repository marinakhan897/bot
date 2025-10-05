module.exports.config = {
    name: "lovevoice",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "Romantic female voice messages",
    commandCategory: "fun",
    usages: "[text]",
    cooldowns: 15,
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
            return api.sendMessage("💖 Usage: !lovevoice [romantic text]\n\nI'll speak your romantic message in a sweet female voice!", event.threadID);
        }
        
        const text = args.join(" ");
        const filePath = __dirname + '/cache/love_voice.mp3';
        
        // Romantic endings with Marina's name
        const romanticEndings = [
            ` ${text}. With all my love, Marina.`,
            ` ${text}. Forever yours, Marina.`,
            ` ${text}. Thinking of you always. Love, Marina.`,
            ` ${text}. You mean the world to me. Yours, Marina.`,
            ` ${text}. Sending you kisses and hugs. Marina here.`
        ];
        
        const randomEnding = romanticEndings[Math.floor(Math.random() * romanticEndings.length)];
        
        // Create romantic female voice
        const voice = new gtts(randomEnding, 'en');
        voice.save(filePath, function (err, result) {
            if (err) {
                console.error(err);
                return api.sendMessage("❌ Error creating romantic voice message!", event.threadID);
            }
            
            // Send romantic voice message
            api.sendMessage({
                body: `💖 Romantic Voice by Marina:\n"${text}"\n\n💕 With love from Marina Khan`,
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
