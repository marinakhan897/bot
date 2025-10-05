module.exports = {
	config: {
		name: "marinareply",
		version: "1.0",
		author: "Marina",
		countDown: 3,
		role: 0,
		description: "Auto-replies about Marina",
		category: "utility"
	},

	onChat: async function ({ api, event }) {
		const message = event.body?.toLowerCase();
		if (!message) return;

		const marinaReplies = {
			'who is marina': '🌸 Marina is my amazing creator! She\'s a powerful bot developer who built me with love and expertise!',
			'who made you': '💻 I was created by the brilliant Marina! She\'s the genius behind all my features!',
			'who is your owner': '👑 My owner is Marina - the most talented bot developer you\'ll ever meet!',
			'thank you marina': '💝 You\'re welcome! Marina programmed me to be helpful and friendly!',
			'hi marina': '👋 Hello! Marina\'s bot here, ready to assist you!',
			'marina is amazing': '🚀 Absolutely! Marina is a coding superstar and an incredible developer!',
			'good job marina': '🎉 Thank you! Marina works hard to make me the best bot possible!',
			'love marina': '❤️ Marina loves her users too! She created me to help everyone!'
		};

		for (const [trigger, response] of Object.entries(marinaReplies)) {
			if (message.includes(trigger)) {
				setTimeout(() => {
					api.sendMessage(response, event.threadID);
				}, 1000);
				break;
			}
		}
	}
};
