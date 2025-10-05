const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "admin",
    version: "3.0.0",
    author: "Marina Khan", 
    countDown: 5,
    role: 0,
    description: "Admin info with multiple photos",
    category: "INFO",
    guide: {
      en: "{pn} - View admin information"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      const { threadID, messageID } = event;

      const assetsPath = path.join(__dirname, 'assets');
      const possibleImages = [
        'marina-profile.jpg',
        'marina-coding.jpg', 
        'marina-project.jpg',
        'marina-ai.jpg'
      ];

      let selectedImage = null;
      
      // Find first available image
      for (const image of possibleImages) {
        const imagePath = path.join(assetsPath, image);
        if (fs.existsSync(imagePath)) {
          selectedImage = imagePath;
          break;
        }
      }

      const adminInfo = `
🎀════════════════════🎀
        🌸 MARINA KHAN 🌸
🎀════════════════════🎀

💫 About Me:
"Hello! I'm Marina Khan, a passionate 
bot developer from Pakistan. I love 
creating intelligent systems that 
make life easier for everyone!"

🌟 What I Do:
• AI Chatbot Development
• JavaScript Programming  
• API Integration
• User Experience Design

📊 Experience:
✅ 3+ Years in Bot Development
✅ 50+ Successful Projects
✅ 1000+ Happy Users

🌐 Get In Touch:
📧 Email: marina.khan@example.com
🔗 GitHub: github.com/marina-khan
📱 Facebook: https://www.facebook.com/DR.SIDRA.SHAH90

💝 Message:
"Thank you for using my bot! 
Your satisfaction is my priority. 
Feel free to contact me anytime! 💖"

🎀════════════════════🎀
      `.trim();

      if (selectedImage) {
        await api.sendMessage({
          body: adminInfo,
          attachment: fs.createReadStream(selectedImage)
        }, threadID, messageID);
      } else {
        await api.sendMessage(adminInfo, threadID, messageID);
      }

    } catch (error) {
      console.error('Admin command error:', error);
      await api.sendMessage("🌸 Marina Khan - Bot Developer\n💌 marina@example.com", event.threadID, event.messageID);
    }
  }
};
