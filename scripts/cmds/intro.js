module.exports = {
	config: {
		name: "intro",
		version: "1.0",
		author: "Marina",
		countDown: 5,
		role: 0,
		description: {
			en: "Introduce the boss - Dr. Marin"
		},
		category: "info",
		guide: {
			en: ""
		}
	},

	onChat: async function ({ api, event, args }) {
		const message = event.body.toLowerCase();
		
		// Keywords that trigger the introduction
		const triggers = [
			"who is marina", "who is marin", "who is your owner", 
			"who created you", "who is your developer", "who made you",
			"marina kaun hai", "marin kaun hai", "owner kaun hai",
			"tera malik kaun hai", "tera developer kaun hai"
		];

		const shouldRespond = triggers.some(trigger => message.includes(trigger));
		
		if (shouldRespond) {
			const introMessage = `🔥 **LISTEN UP! WHEN YOU ASK ABOUT THE LEGEND** 🔥

🤵 **THE NAME'S DR. MARIN** 
   - Age: 23 | Power Level: MAXIMUM 
   - Status: PEAK PERFORMANCE

💼 **DOUBLE LIFE ACTIVATED:**
   ⚕️  By Day: Medical Doctor (Saving Lives)
   💻  By Night: Elite Developer (Creating Legends)

🎯 **SPECIALTIES:**
   • Full-Stack Development
   • Medical Expertise 
   • Bot Creation Mastery
   • Problem Solving Pro

🏠 **BASE OF OPERATIONS:** Sukkur City
💫 **LIFE PHILOSOPHY:** "BINDAS ZINDAGI" - Live Life King Size!

⚠️ **WARNING:** 
   Don't test the skills, don't challenge the authority!
   When Dr. Marin codes, universe listens! 🌌

💪 **POWER QUOTE:** "I don't just write code, I create destinies!"`;

			await api.sendMessage(introMessage, event.threadID);
		}
	}
};
