module.exports = {
  config: {
    name: "roast",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Creative roasting without abuse",
    category: "fun",
    guide: {
      en: ".gali [@tag]"
    }
  },

  onStart: async function({ api, event, args }) {
    const mentions = Object.keys(event.mentions);
    const targetID = mentions[0] || event.senderID;
    
    const creativeRoasts = [
      "Tumhare dimaag ki speed toh dial-up internet jaisi hai! 📞",
      "Tum zyada smart ho jaoge toh bulb fuse ho jayega! 💡",
      "Tumhare jokes sun kar emojis bhi ro dete hain! 😂",
      "Tumhare logic ka GPS lost ho gaya hai! 🗺️",
      "Tumhare liye elevator bhi 'L' button dhoond raha hai! 🛗",
      "Tum intelligent ho, bas tumhe pata nahi hai! 🧠",
      "Tumhare memes 2G speed se aate hain! 📶",
      "Tumhare saath chat karna offline gaming jaisa hai! 🎮"
    ];
    
    const roast = creativeRoasts[Math.floor(Math.random() * creativeRoasts.length)];
    const name = await this.getUserName(api, targetID);
    
    api.sendMessage(`🔥 ${name}\n${roast}`, event.threadID, event.messageID);
  },

  getUserName: async function(api, userID) {
    try {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID].name;
    } catch (error) {
      return "User";
    }
  }
};
