const fs = require("fs-extra");
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
			confirmGlobal: "⚙️ Global prefix change requested.\n🪄 React to confirm.\n📷 See image below.",
			confirmThisThread: "🛠️ Group prefix change requested.\n🪄 React to confirm.\n📷 See image below.",
			successGlobal: "✅ Global prefix changed successfully!\n🆕 New prefix: %1",
			successThisThread: "✅ Group prefix updated!\n🆕 New prefix: %1"
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		if (!args[0]) return message.SyntaxError();

		const prefixImage = "https://i.imgur.com/your-image.png"; // Replace with your PNG URL

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply({
				body: getLang("reset", global.GoatBot.config.prefix),
				attachment: await global.utils.getStreamFromURL(prefixImage)
			});
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

		return message.reply({
			body: confirmMsg,
			attachment: await global.utils.getStreamFromURL(prefixImage)
		}, (err, info) => {
			formSet.messageID = info.messageID;
			global.GoatBot.onReaction.set(info.messageID, formSet);
		});
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
			const senderID = event.senderID;

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

			const prefixImage = "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimages-platform.99static.com%2F%2FvPUS6Ro_LUsG_qmDHapk9K0-t8M%3D%2F91x28%3A702x639%2Ffit-in%2F590x590%2F99designs-contests-attachments%2F55%2F55811%2Fattachment_55811305&tbnid=zYK6Wpm0f4WQ6M&vet=1&imgrefurl=https%3A%2F%2F99designs.com%2Finspiration%2Flogos%2Fmarine&docid=zfcM-bOcmC3rvM&w=590&h=590&source=sh%2Fx%2Fim%2Fm5%2F2&kgs=7bba99f363978e19&shem=bdsc%2Cisst

			return message.reply({
				body: infoBox,
				attachment: await global.utils.getStreamFromURL(prefixImage)
			});
		}
	}
};
