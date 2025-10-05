const axios = require('axios'); // Example dependency

module.exports = {
  config: {
    name: "newcommand2025",
    version: "1.0.0",
    author: "Marina",
    countDown: 5,
    role: 0,
    description: {
      en: "Description of your new 2025 command"
    },
    category: "category",
    guide: {
      en: "{p}newcommand2025 [optional_parameter]"
    }
  },

  // --- ESSENTIAL: The onStart function ---
  onStart: async function ({ api, event, args }) {
    // This function is called when the command is invoked directly
    try {
      // Your main command logic goes here
      const inputText = args.join(" "); // Process arguments

      if (!inputText) {
        // Show help if no arguments are provided
        return api.sendMessage(`🆕 **New Command 2025** 🆕\n\n📝 Usage: ${this.config.guide.en}`, event.threadID);
      }

      // Example: Echo the input
      await api.sendMessage(`✅ You said: "${inputText}"`, event.threadID);

    } catch (error) {
      console.error("Error in newcommand2025:", error);
      api.sendMessage("❌ An error occurred while executing the command.", event.threadID);
    }
  },

  // --- OPTIONAL: The onChat function for auto-response ---
  onChat: async function ({ api, event }) {
    const message = event.body?.toLowerCase();
    if (!message) return;

    // Example: Auto-respond to specific keywords
    const autoTriggers = {
      'hello 2025': '👋 Greetings from the new 2025 command!',
      'test new feature': '🚀 Testing the latest 2025 functionality!'
    };

    for (const [trigger, response] of Object.entries(autoTriggers)) {
      if (message.includes(trigger)) {
        api.sendMessage(response, event.threadID);
        break;
      }
    }
  }
};
