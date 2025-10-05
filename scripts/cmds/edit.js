const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "dpedit",
		version: "1.0",
		author: "Marina",
		countDown: 5,
		role: 0,
		description: {
			en: "Edit profile pictures with various effects"
		},
		category: "image",
		guide: {
			en: "   {pn} [effect] - Apply effect to profile picture\n   {pn} list - Show available effects"
		}
	},

	onStart: async function ({ api, event, args }) {
		try {
			const effectsList = {
				blur: { name: "Blur Effect", value: "blur" },
				sharpen: { name: "Sharpen Effect", value: "sharpen" },
				grayscale: { name: "Black and White", value: "grayscale" },
				sepia: { name: "Vintage Look", value: "sepia" },
				brighten: { name: "Brighten Image", value: "brighten" }
			};

			// Show effects list
			if (args[0] === 'list') {
				let listText = "🎨 **AVAILABLE EDITING EFFECTS** 🎨\n\n";
				for (const [key, effect] of Object.entries(effectsList)) {
					listText += `🔸 ${key}: ${effect.name}\n`;
				}
				listText += "\n✨ Use: !dpedit <effect_name> to edit your profile picture";
				return api.sendMessage(listText, event.threadID);
			}

			const effectKey = args[0]?.toLowerCase();
			
			if (!effectKey || !effectsList[effectKey]) {
				return api.sendMessage(`❌ Please provide a valid effect name\n📋 Type "!dpedit list" to see available effects`, event.threadID);
			}

			// Send loading message
			const loadingMsg = await api.sendMessage(`🔄 Applying ${effectsList[effectKey].name}...\n⏳ Please wait...`, event.threadID);

			try {
				// Get user's profile picture
				const userInfo = await api.getUserInfo(event.senderID);
				const profilePicUrl = userInfo[event.senderID].thumb_src;
				
				// Download profile picture
				const response = await axios({
					method: 'GET',
					url: profilePicUrl,
					responseType: 'stream'
				});

				const imagePath = path.join(__dirname, 'cache', `dp_${event.senderID}.jpg`);
				await fs.ensureDir(path.dirname(imagePath));
				
				const writer = fs.createWriteStream(imagePath);
				response.data.pipe(writer);

				writer.on('finish', async () => {
					// Here you would integrate with your chosen image editing API
					// For now, we'll send the original image as a placeholder
					await api.sendMessage({
						body: `🎨 **PROFILE PICTURE EDITING** 🎨

📝 Effect Applied: ${effectsList[effectKey].name}
👤 User: ${userInfo[event.senderID].name}

✨ Note: Image editing functionality needs to be integrated with an image processing API`,
						attachment: fs.createReadStream(imagePath)
					}, event.threadID);
					
					// Clean up
					await fs.remove(imagePath);
					await api.unsendMessage(loadingMsg.messageID);
				});

			} catch (error) {
				console.error(error);
				await api.sendMessage("❌ Error processing your profile picture. Please try again later.", event.threadID);
				await api.unsendMessage(loadingMsg.messageID);
			}

		} catch (error) {
			console.error(error);
			api.sendMessage("❌ An error occurred while processing your request.", event.threadID);
		}
	}
};
