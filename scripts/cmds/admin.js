const axios = require('axios');

module.exports = {
  config: {
    name: "admin",
    version: "2.0.0",
    author: "Marina Khan",
    countDown: 5,
    role: 0,
    description: "Get real-time admin Facebook information",
    category: "INFO",
    guide: {
      en: "{pn} - View admin's real profile info"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;

      // Your actual Facebook ID (replace with your real ID)
      const YOUR_FACEBOOK_ID = "100087317913519"; // ← Yahan apna real Facebook ID daalein
      
      // Get profile info from Facebook Graph API
      const profileUrl = `https://graph.facebook.com/${YOUR_FACEBOOK_ID}?fields=name,first_name,last_name,gender,link,birthday,location,hometown,email&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const profilePicUrl = `https://graph.facebook.com/${YOUR_FACEBOOK_ID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const [profileResponse, picResponse] = await Promise.all([
        axios.get(profileUrl),
        axios.get(profilePicUrl, { responseType: 'stream' })
      ]);

      const profileData = profileResponse.data;
      
      const infoMessage = `
✨════════════════════════✨
           👑 REAL-TIME ADMIN INFO 👑
✨════════════════════════✨

💖 Name: ${profileData.name || 'Marina Khan'}
👤 First Name: ${profileData.first_name || 'Marina'}
📛 Last Name: ${profileData.last_name || 'Khan'}
⚧️ Gender: ${profileData.gender || 'Female'}
🎂 Birthday: ${profileData.birthday || 'March 15'}
📍 Location: ${profileData.location?.name || 'Pakistan'}
🏠 Hometown: ${profileData.hometown?.name || 'Not specified'}

🔗 Profile Link: ${profileData.link || 'https://facebook.com/marina.khan.official'}
📧 Email: ${profileData.email || 'marina.khan@example.com'}

💫 About Me:
"Hey! I'm Marina Khan - a passionate bot developer and AI enthusiast. 
I love creating amazing automated systems and helping people through technology.
Feel free to reach out for collaborations or just to say hello! 🌸"

🛠️ Skills:
• JavaScript/Node.js Development
• AI Chatbot Creation  
• API Integration
• UI/UX Design
• Problem Solving

📞 Contact:
• Facebook: ${profileData.link || 'Marina Khan'}
• GitHub: https://github.com/marina-khan
• Email: ${profileData.email || 'marina@example.com'}

💌 Message:
"Thanks for using my bot! If you have any suggestions or need help, 
don't hesitate to contact me. I'm always improving this bot! 💖"

✨════════════════════════✨
      `.trim();

      await api.sendMessage({
        body: infoMessage,
        attachment: picResponse.data
      }, threadID, messageID);

    } catch (error) {
      console.error('Admin command error:', error);
      
      // Fallback to static information if API fails
      const staticMessage = `
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

      api.sendMessage(staticMessage, threadID, messageID);
    }
  }
};
