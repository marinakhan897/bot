const os = require('os');
const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "admininfo",
    version: "1.1",
    author: "Marina",
    countDown: 5,
    role: 2, // Owner only
    description: "Display detailed bot administrator information with error handling",
    category: "owner",
    guide: "{p}admininfo"
  },

  onStart: async function ({ api, event, usersData, threadsData }) {
    try {
      // Get basic bot stats safely
      const botStartTime = global.GoatBot.startTime;
      const uptime = process.uptime();
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const seconds = Math.floor(uptime % 60);

      // Attempt to get user and thread counts with error handling
      let totalUsers = "N/A";
      let totalThreads = "N/A";

      try {
        const allUsers = await usersData.getAll();
        const allThreads = await threadsData.getAll();
        totalUsers = allUsers.length;
        totalThreads = allThreads.length;
      } catch (dbError) {
        console.error("Database query error in admininfo:", dbError);
        // We'll use "N/A" values if the query fails
      }

      // Get system information
      const platform = os.platform();
      const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2); // Convert to GB
      const currentTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY HH:mm:ss");

      // Create admin info message
      const adminInfo = `🕊️ **MARINA BOT ADMIN INFORMATION** 🕊️

👑 **OWNER DETAILS**
• Name: Marina
• Status: 🟢 Online & Active

🤖 **BOT STATISTICS**
• Total Users: ${totalUsers}
• Total Threads: ${totalThreads}
• Commands Loaded: ${global.GoatBot.commands?.size || "N/A"}
• Uptime: ${hours}h ${minutes}m ${seconds}s

💻 **SYSTEM STATUS**
• Platform: ${platform}
• Memory: ${totalMem} GB
• Node.js: ${process.version}
• Current Time: ${currentTime}

✨ **Maintained by Marina - Keeping your bot running smoothly!**`;

      // Send the final message
      await api.sendMessage(adminInfo, event.threadID);

    } catch (finalError) {
      console.error("Critical error in admininfo command:", finalError);
      
      // Send a final fallback message
      await api.sendMessage("❌ A critical error occurred while gathering admin information. Please check the console logs for detailed error messages.", event.threadID);
    }
  }
};
