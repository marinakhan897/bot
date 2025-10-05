module.exports = {
  config: {
    name: "fvoice",
    version: "1.0.0",
    permission: 0,
    credits: "Marina Khan",
    description: "Female voice command",
    usePrefix: true,
    category: "utility",  // Using category instead of commandCategory
    usages: "[text]",
    cooldowns: 10,
    dependencies: {
      "gtts": ""
    }
  },

  run: async function({ api, event, args }) {
    try {
      const gtts = require('gtts');
      const fs = require('fs');
      
      if (!args[0]) {
        return api.sendMessage("🎀 Please provide text to convert to speech!\nExample: !fvoice Hello friends", event.threadID);
      }
      
      const text = args.join(" ");
      const filePath = __dirname + `/cache/voice_${event.senderID}.mp3`;
      
      const fullText = `${text}. Message from Marina.`;
      
      const voice = new gtts(fullText, 'en');
      voice.save(filePath, (err) => {
        if (err) return api.sendMessage("Error: " + err.message, event.threadID);
        
        api.sendMessage({
          body: `🔊 Voice Message:\n"${text}"\n\n- Marina Khan`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath));
      });
      
    } catch (error) {
      console.error(error);
      api.sendMessage("Error creating voice: " + error.message, event.threadID);
    }
  }
};
