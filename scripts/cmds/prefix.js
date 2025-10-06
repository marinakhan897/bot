const fs = require("fs-extra");
const path = require("path");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "1.6",
		author: "Marina Khan",
		countDown: 5,
		role: 0,
		description: "Change bot prefix in your group or globally",
		category: "config",
		guide: {
			en: "{pn} <new prefix>: change prefix in this group\n"
				+ "{pn} <new prefix> -g: change global prefix (admin only)\n"
				+ "{pn} reset: reset prefix to default"
		}
	},

	langs: {
		en: {
			reset: "✅ Prefix reset to default:\n➡️  System prefix: %1",
			onlyAdmin: "⛔ Only admin can change the system-wide prefix.",
			confirmGlobal: "⚙️ Global prefix change requested.\n🪄 React to confirm.",
			confirmThisThread: "🛠️ Group prefix change requested.\n🪄 React to confirm.",
			successGlobal: "✅ Global prefix changed successfully!\n🆕 New prefix: %1",
			successThisThread: "✅ Group prefix updated!\n🆕 New prefix: %1"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		// Try multiple possible file locations
		const possiblePaths = [
			// Try in commands folder first
			path.join(__dirname, "marina-prefix.png"),
			// Try in scripts root
			path.join(__dirname, "..", "marina-prefix.png"),
			// Try in assets folder
			path.join(__dirname, "..", "..", "assets", "images", "marina-prefix.png"),
			// Try in data folder
			path.join(__dirname, "..", "..", "data", "marina-prefix.png")
		];

		let prefixImage = null;
		for (const imagePath of possiblePaths) {
			if (fs.existsSync(imagePath)) {
				prefixImage = imagePath;
				break;
			}
		}

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			const messageBody = getLang("reset", global.GoatBot.config.prefix);
			
			if (prefixImage) {
				return message.reply({
					body: messageBody,
					attachment: fs.createReadStream(prefixImage)
				});
			} else {
				return message.reply(messageBody);
			}
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g"
		};

		if (formSet.setGlobal && role < 2)
			return message.reply(getLang("onlyAdmin"));

		const confirmMsg = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");

		if (prefixImage) {
			return message.reply({
				body: confirmMsg,
				attachment: fs.createReadStream(prefixImage)
			}, (err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			});
		} else {
			return message.reply(confirmMsg, (err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			});
		}
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(getLang("successGlobal", newPrefix));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(getLang("successThisThread", newPrefix));
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const systemPrefix = global.GoatBot.config.prefix;
			const groupPrefix = utils.getPrefix(event.threadID);

			const dateTime = new Date().toLocaleString("en-US", {
				timeZone: "Asia/Dhaka",
				hour: "2-digit",
				minute: "2-digit",
				hour12: true,
				day: "2-digit",
				month: "2-digit",
				year: "numeric"
			});

			const [datePart, timePart] = dateTime.split(", ");

			const infoBox = `
╔═════ MARINA CHATBOT ════╗
🌐 System Prefix  : ${systemPrefix.padEnd(10)}
💬 Group Prefix   : ${groupPrefix.padEnd(10)} 
🕒 Time           : ${timePart.padEnd(10)} 
📅 Date           : ${datePart.padEnd(10)}
👑 Created By     : Marina Khan
╚══════════════════════════╝`;

			// Try to find the image file
			const possiblePaths = [
				path.join(__dirname, "marina-prefix.png"),
				path.join(__dirname, "..", "marina-prefix.png"),
				path.join(__dirname, "..", "..", "assets", "images", "marina-prefix.png"),
				path.join(__dirname, "..", "..", "data", "marina-prefix.png")
			];

			let prefixImage = null;
			for (const imagePath of possiblePaths) {
				if (fs.existsSync(imagePath)) {
					prefixImage = imagePath;
					break;
				}
			}

			if (prefixImage) {
				return message.reply({
					body: infoBox,
					attachment: fs.createReadStream(prefixImage)
				});
			} else {
				return message.reply(infoBox);
			}
		}
	}
};
