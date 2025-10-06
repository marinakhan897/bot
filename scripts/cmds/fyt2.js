module.exports.config = {
    name: "fyt",
    version: "1.0.0",
    hasPermssion: 2, // 2 = Only Admin can use
    credits: "Marina Khan",
    description: "Admin only spam command with love",
    commandCategory: "group",
    usages: "fyt [message]",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.run = async function({ api, args, Users, event, Threads }) {
  // Check if user is admin (additional check)
  try {
    const threadInfo = await Threads.getInfo(event.threadID);
    const userID = event.senderID;
    
    // Check if user is admin in the thread
    const isAdmin = threadInfo.adminIDs.some(admin => admin.id == userID);
    
    if (!isAdmin && event.senderID != api.getCurrentUserID()) {
      return api.sendMessage(`❌ Sorry darling! Only admins can use this command! 💝\n\n- Marina Khan 🎀`, event.threadID);
    }
  } catch (error) {
    // If check fails, still proceed with hasPermssion check
    console.log("Admin check failed, using hasPermssion");
  }

  var say = args.join(" ");
  
  if (!say) {
    return api.sendMessage(`🌸💖 **FYT COMMAND** 💖🌸\n\nUsage: fyt [message]\n\nExample: fyt I love you\n\n💝 Admin only command by Marina Khan 🎀`, event.threadID);
  }

  // Get user name for personal touch
  try {
    var userName = await Users.getNameUser(event.senderID);
  } catch (error) {
    var userName = "Admin";
  }

  var sendMessage = function (message) { 
      api.sendMessage(message, event.threadID); 
  }

  // Send admin notification
  sendMessage(`🔰 **ADMIN COMMAND ACTIVATED** 🔰\n\n🌸 Admin: ${userName}\n💖 Command: fyt\n🎀 Target: ${say}\n\n💝 Powered by Marina Khan`);

  // Feminine cute spam messages
  setTimeout(() => {
    sendMessage(`💝 ${say} 💝\nI LOVE YOU SO MUCH MY DARLING! 🥰`);
  }, 500);
  
  setTimeout(() => {
    sendMessage(`✨ ${say} ✨\nI MISS YOU EVERY SINGLE DAY! 🌙`);
  }, 1000);
  
  setTimeout(() => {
    sendMessage(`🌸 ${say} 🌸\nYOU'RE THE MOST BEAUTIFUL PERSON! 💖`);
  }, 1500);
  
  setTimeout(() => {
    sendMessage(`💫 ${say} 💫\nMY HEART BEATS ONLY FOR YOU! 💓`);
  }, 2000);
  
  setTimeout(() => {
    sendMessage(`🎀 ${say} 🎀\nYOU MAKE MY WORLD COMPLETE! 🌍`);
  }, 2500);
  
  setTimeout(() => {
    sendMessage(`💕 ${say} 💕\nI CAN'T STOP THINKING ABOUT YOU! 🤗`);
  }, 3000);
  
  setTimeout(() => {
    sendMessage(`🌹 ${say} 🌹\nYOU'RE MY EVERYTHING SWEETHEART! 💝`);
  }, 3500);
  
  setTimeout(() => {
    sendMessage(`🌸💖 **LOVE BOMB COMPLETED** 💖🌸\n\n🔰 Admin: ${userName}\n💝 Message: ${say}\n✨ Messages Sent: 7\n\n🎀 Created by Marina Khan`);
  }, 4000);
}
