module.exports = {
  config: {
    name: "remind",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Set reminders",
    category: "utility",
    guide: {
      en: ".remind [time] [message]"
    }
  },

  onStart: async function({ api, event, args }) {
    if (args.length < 2) {
      return api.sendMessage("❌ Usage: .remind 5m Buy milk", event.threadID, event.messageID);
    }
    
    const time = args[0];
    const message = args.slice(1).join(" ");
    
    // Simple time parser (5m, 10m, 1h)
    let milliseconds = 0;
    if (time.endsWith('m')) {
      milliseconds = parseInt(time) * 60 * 1000;
    } else if (time.endsWith('h')) {
      milliseconds = parseInt(time) * 60 * 60 * 1000;
    } else {
      milliseconds = parseInt(time) * 60 * 1000; // default to minutes
    }
    
    api.sendMessage(`⏰ Reminder set for ${time}: "${message}"`, event.threadID, event.messageID);
    
    setTimeout(() => {
      api.sendMessage(`🔔 REMINDER: ${message}`, event.threadID);
    }, milliseconds);
  }
};
