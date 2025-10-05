module.exports.config = {
    name: "fvoice",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "Female voice with Marina name",
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
            return api.sendMessage("🎀 Usage: !fvoice [text]\n\nI'll speak your text in a female voice and say Marina at the end!", event.threadID);
        }
        
        const text = args.join(" ");
        const filePath = __dirname + '/cache/female_voice.mp3';
        
        // Add Marina name at the end with feminine tone
        const fullText = `${text}. This is Marina signing off.`;
        
        // Create female voice (using English female voice)
        const voice = new gtts(fullText, 'en');
        voice.save(filePath, function (err, result) {
            if (err) {
                console.error(err);
                return api.sendMessage("❌ Error creating voice message!", event.threadID);
            }
            
            // Send voice message
            api.sendMessage({
                body: `🎀 Marina's Female Voice:\n"${text}"\n\n— Marina Khan 💝`,
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
