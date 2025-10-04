// Save as: scripts/cmds/quran.js
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "quran",
    version: "1.0.0",
    role: 0,
    shortDescription: "Listen to Quran recitation",
    longDescription: "Play Quran recitation by different reciters",
    category: "islamic",
    guide: "{p}quran [surah_number] or {p}quran list"
  },

  onChat: async function({ message, event, args, api }) {
    try {
      const surahList = {
        1: { name: "Al-Fatihah", verses: 7 },
        2: { name: "Al-Baqarah", verses: 286 },
        36: { name: "Ya-Sin", verses: 83 },
        55: { name: "Ar-Rahman", verses: 78 },
        67: { name: "Al-Mulk", verses: 30 },
        // Add more surahs as needed
      };

      // Show surah list if requested
      if (args[0] === 'list') {
        let listText = "📖 Available Surahs:\n\n";
        for (const [num, surah] of Object.entries(surahList)) {
          listText += `${num}. ${surah.name} (${surah.verses} verses)\n`;
        }
        listText += "\nUse: !quran <surah_number>";
        return message.reply(listText);
      }

      const surahNumber = parseInt(args[0]);
      
      if (!surahNumber || !surahList[surahNumber]) {
        return message.reply(`❌ Please provide a valid surah number (1-114)\nType "!quran list" to see available surahs`);
      }

      const surah = surahList[surahNumber];
      
      // Send initial message
      const loadingMsg = await message.reply(`🕋 Loading Surah ${surah.name}...\n⏳ Please wait...`);

      // Quran API endpoint (using Al-Quran Cloud API)
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}.mp3`;

      // Download and send audio
      const response = await axios({
        method: 'GET',
        url: audioUrl,
        responseType: 'stream'
      });

      const audioPath = path.join(__dirname, '..', 'temp', `quran_${surahNumber}.mp3`);
      await fs.ensureDir(path.dirname(audioPath));
      
      const writer = fs.createWriteStream(audioPath);
      response.data.pipe(writer);

      writer.on('finish', async () => {
        await api.sendMessage({
          body: `🕋 Quran Recitation\n\n📖 Surah: ${surah.name}\n🔢 Number: ${surahNumber}\n📜 Verses: ${surah.verses}\n🎤 Reciter: Mishari Rashid Alafasy`,
          attachment: fs.createReadStream(audioPath)
        }, event.threadID);
        
        // Clean up
        await fs.remove(audioPath);
        await api.unsendMessage(loadingMsg.messageID);
      });

      writer.on('error', (error) => {
        console.error(error);
        message.reply("❌ Error downloading audio file");
      });

    } catch (error) {
      console.error(error);
      message.reply("❌ Error playing Quran recitation. Please try again later.");
    }
  }
};
