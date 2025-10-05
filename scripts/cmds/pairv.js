const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

module.exports = {
  config: {
    name: "pair",
    version: "2.0.0",
    role: 0,
    author: "Marina Khan",
    category: "fun",
    shortDescription: "Check love compatibility",
    longDescription: "Check love compatibility between two users with beautiful graphics",
    guide: "{pn} [@mention1 | @mention2] or {pn} [name1 | name2]",
    countDown: 15,
    dependencies: {
      "fs-extra": "",
      "axios": "",
      "canvas": ""
    }
  },

  onStart: async function({ api, event, args, usersData }) {
    try {
      const { threadID, messageReply, senderID } = event;
      
      let name1, name2, uid1, uid2;

      // Check if replying to a message with mentions
      if (messageReply && messageReply.mentions) {
        const mentions = Object.keys(messageReply.mentions);
        if (mentions.length >= 2) {
          uid1 = mentions[0];
          uid2 = mentions[1];
          name1 = messageReply.mentions[uid1];
          name2 = messageReply.mentions[uid2];
        }
      }
      
      // Check current message mentions
      if (event.mentions && Object.keys(event.mentions).length >= 2) {
        const mentions = Object.keys(event.mentions);
        uid1 = mentions[0];
        uid2 = mentions[1];
        name1 = event.mentions[uid1];
        name2 = event.mentions[uid2];
      } 
      // Check if names provided as text
      else if (args.length >= 2 && args.includes('|')) {
        const names = args.join(' ').split('|').map(n => n.trim());
        if (names.length >= 2) {
          name1 = names[0];
          name2 = names[1];
          uid1 = senderID;
          uid2 = senderID;
        }
      }
      // Default: sender and mentioned person
      else if (event.mentions && Object.keys(event.mentions).length === 1) {
        const mentions = Object.keys(event.mentions);
        uid1 = senderID;
        uid2 = mentions[0];
        const user1 = await usersData.get(senderID);
        const user2 = await usersData.get(uid2);
        name1 = user1.name;
        name2 = event.mentions[uid2];
      }
      // No valid input
      else {
        return api.sendMessage(`💕 Marina's Pair Compatibility\n\nUsage:\n• ${this.config.guide}\n\nExamples:\n• pair @user1 @user2\n• pair John | Jane\n• Reply to a message with two mentions`, threadID);
      }

      // Calculate compatibility percentage (fun algorithm)
      const compatibility = calculateCompatibility(name1, name2, uid1, uid2);
      
      // Get relationship status and message
      const { status, message, emoji } = getRelationshipStatus(compatibility);
      
      // Create beautiful pair result
      const pairMessage = createPairMessage(name1, name2, compatibility, status, message, emoji);
      
      // Try to send with image (fallback to text if error)
      try {
        const imageUrl = await generatePairImage(name1, name2, compatibility, status);
        if (imageUrl) {
          await api.sendMessage({
            body: pairMessage,
            attachment: await global.utils.getStreamFromURL(imageUrl)
          }, threadID);
        } else {
          throw new Error("No image generated");
        }
      } catch (imageError) {
        console.log("Image generation failed, sending text only:", imageError);
        await api.sendMessage(pairMessage, threadID);
      }

    } catch (error) {
      console.error("Pair command error:", error);
      api.sendMessage("❌ Error calculating pair compatibility. Please try again!", event.threadID);
    }
  }
};

// Compatibility calculation algorithm
function calculateCompatibility(name1, name2, uid1, uid2) {
  // Combine names and IDs for seed
  const seed = (name1 + name2 + uid1 + uid2).toLowerCase();
  let hash = 0;
  
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash = hash & hash;
  }
  
  // Base compatibility (50-95%)
  let compatibility = 50 + Math.abs(hash % 46);
  
  // Name length bonus
  const nameBonus = Math.min(name1.length, name2.length) * 0.5;
  compatibility += nameBonus;
  
  // First letter match bonus
  if (name1[0].toLowerCase() === name2[0].toLowerCase()) {
    compatibility += 5;
  }
  
  // Ensure within 1-100 range
  return Math.max(1, Math.min(100, Math.round(compatibility)));
}

// Get relationship status based on percentage
function getRelationshipStatus(percentage) {
  if (percentage >= 90) {
    return {
      status: "Soulmates 💞",
      message: "Perfect match! You two are meant to be together!",
      emoji: "💞"
    };
  } else if (percentage >= 80) {
    return {
      status: "Amazing Couple 💖",
      message: "Excellent compatibility! Strong potential for a beautiful relationship.",
      emoji: "💖"
    };
  } else if (percentage >= 70) {
    return {
      status: "Great Match 💕",
      message: "Very good compatibility! You two would make a lovely couple.",
      emoji: "💕"
    };
  } else if (percentage >= 60) {
    return {
      status: "Good Potential 💝",
      message: "Good match! With effort, this could become something special.",
      emoji: "💝"
    };
  } else if (percentage >= 50) {
    return {
      status: "Possible Match 💗",
      message: "Average compatibility. Could work with understanding and patience.",
      emoji: "💗"
    };
  } else if (percentage >= 40) {
    return {
      status: "Challenging 💔",
      message: "Might require extra effort and understanding to make it work.",
      emoji: "💔"
    };
  } else if (percentage >= 30) {
    return {
      status: "Difficult Match 💢",
      message: "Compatibility is low. Might face many challenges.",
      emoji: "💢"
    };
  } else if (percentage >= 20) {
    return {
      status: "Not Recommended ❌",
      message: "Very low compatibility. Better stay as friends.",
      emoji: "❌"
    };
  } else {
    return {
      status: "Impossible Match 💀",
      message: "Extremely low compatibility. Not recommended at all.",
      emoji: "💀"
    };
  }
}

// Create beautiful pair message
function createPairMessage(name1, name2, percentage, status, message, emoji) {
  const progressBar = createProgressBar(percentage);
  
  return `💕 **Marina's Love Compatibility** 💕

┌─────── ✦ PAIR RESULT ✦ ───────┐
│
│  💖 **${name1}** + **${name2}** 💖
│
│  📊 Compatibility: **${percentage}%**
│  ${progressBar}
│
│  🏷️  Status: ${status}
│  💌 Message: ${message}
│
│  ✨ _Calculated by Marina's Magic_ ✨
│
└────────────────────────────┘

💝 Marina Khan's Love Analysis`;
}

// Create visual progress bar
function createProgressBar(percentage) {
  const filled = '█';
  const empty = '▒';
  const totalBlocks = 10;
  const filledBlocks = Math.round((percentage / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  
  return `│  [${filled.repeat(filledBlocks)}${empty.repeat(emptyBlocks)}]`;
}

// Generate pair image (simplified version)
async function generatePairImage(name1, name2, percentage, status) {
  try {
    // Using a simple API for love meter images
    const apiUrl = `https://api.popcat.xyz/ship?user1=${encodeURIComponent(name1)}&user2=${encodeURIComponent(name2)}`;
    const response = await axios.get(apiUrl, { responseType: 'stream' });
    return apiUrl;
  } catch (error) {
    // Fallback to text-based
    return null;
  }
}
