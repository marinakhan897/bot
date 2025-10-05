module.exports = {
  config: {
    name: "mood",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Check bot's current mood",
    category: "fun",
    guide: {
      en: ".mood"
    }
  },

  onStart: async function({ api, event }) {
    const moods = [
      "Feeling awesome today! 😎",
      "A bit sleepy... but ready to help! 😴",
      "Hyperactive mode activated! ⚡",
      "Chilling like a villain! 😼",
      "Feeling mysterious... 🕵️‍♀️",
      "Happy and energetic! 🌟",
      "Thinking deep thoughts... 🤔",
      "Ready for some fun! 🎮"
    ];
    
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    api.sendMessage(`🤖 Bot Mood: ${randomMood}`, event.threadID, event.messageID);
  }
};
