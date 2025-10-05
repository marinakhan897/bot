const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "time",
    version: "2.0.0",
    role: 0,
    author: "Marina Khan",
    category: "utility",
    shortDescription: "Time reminders and greetings",
    longDescription: "Get current time with beautiful greetings and set reminders",
    guide: "{pn} - Current time\n{pn} set [minutes] [message] - Set reminder\n{pn} list - Show active reminders",
    countDown: 5
  },

  onStart: async function({ api, event, args }) {
    try {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const greeting = getGreeting(now);
      const emoji = getTimeEmoji(now);

      if (args[0] === "set" && args.length >= 3) {
        return await setReminder(api, event, args);
      } else if (args[0] === "list") {
        return await listReminders(api, event);
      }

      const timeMessage = `
🕰️ **Marina's Time & Greetings** 🕰️

╔══════════════════╗
║     ${emoji} ${greeting} ${emoji}     ║
╠══════════════════╣
║                                    ║
║  📅 **Date:** ${dateString}  ║
║  ⏰ **Time:** ${timeString}        ║
║                                    ║
║  💝 ${getMotivationalQuote()}     ║
║                                    ║
║  🌸 _Have a wonderful day!_ 🌸   ║
║                                    ║
╚══════════════════╝

✨ Marina Khan's Time Service ✨

💡 Tip: Use "time set 30 meeting" to set a reminder!
      `;

      api.sendMessage(timeMessage, event.threadID);

    } catch (error) {
      console.error("Time command error:", error);
      api.sendMessage("❌ Error getting time information.", event.threadID);
    }
  }
};

// Get appropriate greeting based on time
function getGreeting(time) {
  const hour = time.getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning 🌅";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon ☀️";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening 🌇";
  } else {
    return "Good Night 🌙";
  }
}

// Get emoji based on time
function getTimeEmoji(time) {
  const hour = time.getHours();
  
  if (hour >= 5 && hour < 12) return "🌄";
  if (hour >= 12 && hour < 17) return "🏙️";
  if (hour >= 17 && hour < 21) return "🌆";
  return "🌃";
}

// Get motivational quotes
function getMotivationalQuote() {
  const quotes = [
    "Every moment is a fresh beginning!",
    "Make today so awesome that yesterday gets jealous!",
    "Your time is limited, don't waste it living someone else's life!",
    "The future depends on what you do today!",
    "Dream big and dare to fail!",
    "You're capable of amazing things!",
    "Today is your opportunity to build the tomorrow you want!",
    "Keep your face to the sunshine and shadows will fall behind you!",
    "Small steps every day lead to big results!",
    "You're doing better than you think you are!"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// Set reminder function
async function setReminder(api, event, args) {
  const minutes = parseInt(args[1]);
  const reminderMessage = args.slice(2).join(' ');
  
  if (isNaN(minutes) || minutes <= 0) {
    return api.sendMessage("❌ Please provide a valid number of minutes!", event.threadID);
  }
  
  if (!reminderMessage) {
    return api.sendMessage("❌ Please provide a reminder message!", event.threadID);
  }
  
  const reminderTime = new Date(Date.now() + minutes * 60000);
  const timeString = reminderTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Save reminder to file (simplified version)
  const reminder = {
    threadID: event.threadID,
    userID: event.senderID,
    message: reminderMessage,
    triggerTime: reminderTime.getTime(),
    setTime: Date.now()
  };
  
  const remindersPath = path.join(__dirname, 'timeReminders.json');
  let reminders = [];
  
  try {
    if (fs.existsSync(remindersPath)) {
      reminders = JSON.parse(fs.readFileSync(remindersPath, 'utf8'));
    }
    reminders.push(reminder);
    fs.writeFileSync(remindersPath, JSON.stringify(reminders, null, 2));
  } catch (error) {
    console.error("Error saving reminder:", error);
  }
  
  const confirmation = `
⏰ **Reminder Set Successfully!** ⏰

╔══════════════════╗
║     📋 REMINDER     ║
╠══════════════════╣
║                                    ║
║  ⏰ **Time:** ${timeString}          ║
║  📝 **Message:** ${reminderMessage} ║
║  ⏳ **In:** ${minutes} minutes      ║
║                                    ║
║  💝 I'll remind you! 💝          ║
║                                    ║
╚══════════════════╝

✨ Marina's Reminder Service ✨
  `;
  
  api.sendMessage(confirmation, event.threadID);
  
  // Set timeout for reminder (simplified)
  setTimeout(async () => {
    try {
      const reminderAlert = `
🔔 **REMINDER FROM MARINA** 🔔

╔══════════════════╗
║     ⏰ ALERT!     ║
╠══════════════════╣
║                                    ║
║  📝 ${reminderMessage}           ║
║                                    ║
║  💝 Set ${minutes} minutes ago    ║
║                                    ║
╚══════════════════╝

🌸 Time to take action! 🌸
      `;
      
      api.sendMessage(reminderAlert, event.threadID);
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  }, minutes * 60000);
}

// List active reminders
async function listReminders(api, event) {
  const remindersPath = path.join(__dirname, 'timeReminders.json');
  
  try {
    if (!fs.existsSync(remindersPath)) {
      return api.sendMessage("📝 You have no active reminders!", event.threadID);
    }
    
    const reminders = JSON.parse(fs.readFileSync(remindersPath, 'utf8'));
    const userReminders = reminders.filter(r => r.userID === event.senderID);
    
    if (userReminders.length === 0) {
      return api.sendMessage("📝 You have no active reminders!", event.threadID);
    }
    
    let reminderList = "📋 **Your Active Reminders** 📋\n\n";
    
    userReminders.forEach((reminder, index) => {
      const triggerTime = new Date(reminder.triggerTime);
      const timeString = triggerTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      reminderList += `${index + 1}. ⏰ ${timeString} - ${reminder.message}\n`;
    });
    
    reminderList += "\n✨ Marina's Reminder Service ✨";
    
    api.sendMessage(reminderList, event.threadID);
    
  } catch (error) {
    console.error("Error listing reminders:", error);
    api.sendMessage("❌ Error retrieving reminders.", event.threadID);
  }
}
