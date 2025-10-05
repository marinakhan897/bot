const os = require('os');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports = {
	config: {
		name: "admininfo",
		version: "1.0",
		author: "Marina",
		countDown: 5,
		role: 2, // Owner only
		description: {
			en: "Display detailed bot administrator information"
		},
		category: "owner",
		guide: {
			en: "{p}admininfo"
		}
	},

	onStart: async function ({ api, event, args, usersData, threadsData }) {
		try {
			// Bot information
			const botStartTime = global.GoatBot.startTime;
			const uptime = process.uptime();
			const hours = Math.floor(uptime / (60 * 60));
			const minutes = Math.floor((uptime % (60 * 60)) / 60);
			const seconds = Math.floor(uptime % 60);
			
			// System information
			const platform = os.platform();
			const arch = os.arch();
			const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
			const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
			const usedMem = (totalMem - freeMem).toFixed(2);
			
			// Bot statistics
			const allUsers = await usersData.getAll();
			const allThreads = await threadsData.getAll();
			const totalUsers = allUsers.length;
			const totalThreads = allThreads.length;
			
			// Active threads (with recent activity)
			const activeThreads = allThreads.filter(thread => 
				thread.lastEvent && (Date.now() - thread.lastEvent) < (24 * 60 * 60 * 1000)
			).length;
			
			// Bot configuration
			const botName = global.config.BOTNAME || "Marina Bot";
			const prefix = global.config.PREFIX || "!";
			const adminUID = global.config.ADMINBOT || "Not Set";
			
			// Current time
			const currentTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");
			
			// Create admin info message
			const adminInfo = `🕊️ **MARINA BOT ADMIN INFORMATION** 🕊️

👑 **OWNER DETAILS**
• Name: Marina
• Role: Bot Administrator & Developer
• Status: 🟢 Online & Active

🤖 **BOT CONFIGURATION**
• Bot Name: ${botName}
• Prefix: ${prefix}
• Admin UID: ${adminUID}
• Version: 2.0.0
• Framework: Goat-Bot-V2

📊 **BOT STATISTICS**
• Total Users: ${totalUsers}
• Total Threads: ${totalThreads}
• Active Threads (24h): ${activeThreads}
• Commands Loaded: ${global.GoatBot.commands.size}
• Events Loaded: ${global.GoatBot.eventCommands.size}

⏰ **SYSTEM STATUS**
• Uptime: ${hours}h ${minutes}m ${seconds}s
• Start Time: ${moment(botStartTime).format("DD/MM/YYYY HH:mm:ss")}
• Current Time: ${currentTime}

💻 **SERVER INFORMATION**
• Platform: ${platform}
• Architecture: ${arch}
• Memory Usage: ${usedMem}GB / ${totalMem}GB
• CPU Cores: ${os.cpus().length}
• Node.js: ${process.version}

🔧 **ADMIN FEATURES**
• Bot Restart Capability
• User Management
• Thread Management  
• System Monitoring
• Command Control
• Auto-Reply Setup

✨ **SPECIAL PRIVILEGES**
• Full System Access
• Database Management
• Real-time Monitoring
• Emergency Controls
• Update Deployment

🌙 **Maintained by Marina - Keeping your bot running smoothly!**`;

			// Send the admin information
			await api.sendMessage(adminInfo, event.threadID);

		} catch (error) {
			console.error("Admin Info Error:", error);
			await api.sendMessage("❌ Error retrieving admin information. Please check the console for details.", event.threadID);
		}
	}
};
