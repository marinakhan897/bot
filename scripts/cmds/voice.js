module.exports = {
  config: {
    name: "voice",
    version: "1.0.0",
    role: 0,
    author: "Marina Khan",
    description: "Female voice with Marina name",
    category: "media",  // Changed from commandCategory to category
    guide: "{pn} [text]",
    countDown: 10,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "gtts": ""
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const gtts = require('gtts');
      const fs = require('fs-extra');
      
      if (!args[0]) {
        return api.sendMessage("🎀 Usage: !voice [text]\n\nI'll speak your text in a female voice!", event.threadID);
      }
      
      const text = args.join(" ");
      const filePath = __dirname + '/cache/voice_' + Date.now() + '.mp3';
      
      // Add Marina name at the end
      const fullText = `${text}. This is Marina signing off.`;
      
      const voice = new gtts(fullText, 'en');
      voice.save(filePath, function (err, result) {
        if (err) {
          console.error(err);
          return api.sendMessage("❌ Error creating voice message!", event.threadID);
        }
        
        api.sendMessage({
          body: `🎀 Marina's Voice:\n"${text}"\n\n— Marina Khan 💝`,
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
};
