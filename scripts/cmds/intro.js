const fs = require('fs-extra');
const path = require('path');

module.exports = {
	config: {
		name: "marin",
		version: "1.0",
		author: "Marina",
		countDown: 5,
		role: 0,
		description: {
			en: "Know about Dr. Marin - The Boss"
		},
		category: "info",
		guide: {
			en: "{p}marin"
		}
	},

	onStart: async function ({ api, event, args }) {
		try {
			const bossInfo = `⚡ **DR. MARIN - THE ULTIMATE POWER** ⚡

🎯 **BASIC INFO:**
• Name: Dr. Marin
• Age: 23 Years Young
• Residence: Sukkur City
• Status: Living BINDAS ZINDAGI

💼 **PROFESSIONAL LIFE:**
🏥 Medical Doctor - Saving Lives by Day
💻 Power Developer - Creating Legends by Night

🚀 **SPECIAL POWERS:**
• Code Wizardry
• Medical Expertise
• Bot Development Master
• Problem Solver Extraordinaire

💫 **LIFE MOTTO:**
"BINDAS ZINDAGI" - Why stress when you can dominate?

⚠️ **WARNING TO HATERS:**
Don't challenge the skills!
When Dr. Marin is in the game, everyone else is just playing! 😎

🔥 **FINAL MESSAGE:**
Respect the Developer, Respect the Doctor!`;

			await api.sendMessage(bossInfo, event.threadID);
			
		} catch (error) {
			console.error(error);
			await api.sendMessage("❌ Error showing boss information!", event.threadID);
		}
	}
};
