const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "quran2",
		version: "1.0",
		author: "Marina",
		countDown: 5,
		role: 0,
		description: {
			en: "Quran recitation with multiple reciters"
		},
		category: "islamic",
		guide: {
			en: "   {pn} [surah] [reciter]\n   Reciters: alafasy, husary, minshawi, sudais"
		}
	},

	onStart: async function ({ api, event, args }) {
		const reciters = {
			alafasy: { name: "Mishari Rashid Alafasy", code: "mishari_al_afasy" },
			husary: { name: "Mahmoud Khalil Al-Husary", code: "mahmoud_khalil_al_husary" },
			minshawi: { name: "Mohamed Siddiq Al-Minshawi", code: "mohammad_siddeeq_al_minshaawee" },
			sudais: { name: "Abdur Rahman As-Sudais", code: "abdurrahmaan_as-sudays" }
		};

		const surah = args[0] || '1';
		const reciterKey = args[1] || 'alafasy';
		const reciter = reciters[reciterKey];

		if (!reciter) {
			return api.sendMessage(`❌ Invalid reciter. Available: ${Object.keys(reciters).join(', ')}`, event.threadID);
		}

		try {
			const loadingMsg = await api.sendMessage(`📖 Loading Quran...\n🎤 Reciter: ${reciter.name}\n⏳ Please wait...`, event.threadID);

			const audioUrl = `https://download.quranicaudio.com/quran/${reciter.code}/${surah}.mp3`;

			const response = await axios({
				method: 'GET',
				url: audioUrl,
				responseType: 'stream'
			});

			const audioPath = path.join(__dirname, 'cache', `quran_${surah}_${reciterKey}.mp3`);
			await fs.ensureDir(path.dirname(audioPath));
			
			const writer = fs.createWriteStream(audioPath);
			response.data.pipe(writer);

			writer.on('finish', async () => {
				await api.sendMessage({
					body: `🕋 **QURAN RECITATION** 🕋

🎤 Reciter: ${reciter.name}
📖 Surah: ${surah}

🌙 Blessed listening... May Allah bless you ✨`,
					attachment: fs.createReadStream(audioPath)
				}, event.threadID);
				
				await fs.remove(audioPath);
				await api.unsendMessage(loadingMsg.messageID);
			});

		} catch (error) {
			console.error(error);
			api.sendMessage("❌ Error playing Quran recitation. Surah might not be available with this reciter.", event.threadID);
		}
	}
};
