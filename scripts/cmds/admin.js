const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "admin",
    version: "2.0.0",
    author: "Marina Khan",
    countDown: 5,
    role: 0,
    description: "Get bot admin's Facebook information and profile",
    category: "INFO",
    guide: {
      en: "{pn} - View admin information"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;

      // Your Facebook Information
      const adminInfo = {
        name: "Marina Khan",
        facebookId: "100087317913519", // Replace with your actual Facebook ID
        gender: "Female",
        relationship: "Single",
        bio: "🌟 Bot Developer & AI Enthusiast\n💫 Creating Amazing Bots\n🎀 Loves Coding & Design\n🌸 Always Learning New Things",
        followers: "1.2K",
        following: "856",
        posts: "324",
        location: "Pakistan",
        website: "https://github.com/marina-khan",
        email: "marina.khan@example.com",
        birthday: "March 15",
        profileLink: "https://facebook.com/marina.khan.official"
      };

      // Create information message
      const infoMessage = `
✨════════════════════════✨
           👑 ADMIN INFORMATION 👑
✨════════════════════════✨

💖 Name: ${adminInfo.name}
🆔 Facebook ID: ${adminInfo.facebookId}
👤 Gender: ${adminInfo.gender}
💝 Relationship: ${adminInfo.relationship}
🎂 Birthday: ${adminInfo.birthday}
📍 Location: ${adminInfo.location}

📝 Bio:
${adminInfo.bio}

📊 Profile Stats:
👥 Followers: ${adminInfo.followers}
💫 Following: ${adminInfo.following}
📮 Posts: ${adminInfo.posts}

🌐 Contact:
📧 Email: ${adminInfo.email}
🔗 Website: ${adminInfo.website}
📱 Profile: ${adminInfo.profileLink}

💌 Message: 
"Hello! I'm Marina Khan, the developer of this bot. 
Feel free to contact me for any queries or collaborations! 
I'm always happy to help! 💖"

✨════════════════════════✨
      `.trim();

      try {
        // Try to get profile picture
        const profilePicUrl = `https://graph.facebook.com/${adminInfo.facebookId}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
        
        const response = await axios({
          method: 'GET',
          url: profilePicUrl,
          responseType: 'stream'
        });

        await api.sendMessage({
          body: infoMessage,
          attachment: response.data
        }, threadID, messageID);

      } catch (imageError) {
        // If image fails, send text only
        console.log('Profile image not available, sending text only');
        await api.sendMessage(infoMessage, threadID, messageID);
      }

    } catch (error) {
      console.error('Admin command error:', error);
      
      // Fallback message if everything fails
      const errorMessage = `
✨════════════════════════✨
           👑 ADMIN INFORMATION 👑
✨════════════════════════✨

💖 Name: Marina Khan
👤 Gender: Female  
💝 Relationship: Single
🎂 Birthday: March 15
📍 Location: Pakistan

📝 Bio:
"Bot Developer & AI Enthusiast | 
Creating amazing automated solutions | 
Always learning and growing 🌟"

🌐 Contact:
📧 Email: marina.khan@example.com
🔗 GitHub: https://github.com/marina-khan
📱 Facebook: Marina Khan

💌 Message:
"Hello! I'm the creator of this bot. 
For any queries or collaborations, feel free to contact me! 
I'm always happy to help! 💖"

✨════════════════════════✨
      `.trim();

      await api.sendMessage(errorMessage, event.threadID, event.messageID);
    }
  },

  handleEvent: async function({ api, event }) {
    try {
      const { threadID, body } = event;
      
      if (!body) return;

      // Auto-reply when someone asks for admin info
      const adminKeywords = [
        'admin', 'owner', 'creator', 'developer', 'marina',
        'admin info', 'bot owner', 'who made this bot',
        'bot creator', 'contact admin', 'admin contact',
        'marina khan', 'admin details', 'who created you',
        'who is your owner'
      ];

      const message = body.toLowerCase().trim();
      
      if (adminKeywords.some(keyword => message.includes(keyword))) {
        // Delay response to make it natural
        setTimeout(async () => {
          try {
            await this.onStart({ api, event, args: [] });
          } catch (error) {
            console.error('Auto-reply error:', error);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('HandleEvent error:', error);
    }
  }
};
