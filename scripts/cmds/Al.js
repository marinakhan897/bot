const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "aimode",
    version: "3.0.0",
    role: 0,
    author: "Marina Khan",
    category: "ai",
    shortDescription: "Activate AI Assistant Mode",
    longDescription: "Transform the bot into an intelligent AI assistant with multiple personalities",
    guide: "{pn} on - Activate AI mode\n{pn} off - Deactivate AI mode\n{pn} personality [name] - Change AI personality",
    countDown: 5
  },

  onStart: async function({ api, event, args, threadsData }) {
    try {
      const action = args[0]?.toLowerCase();
      
      switch(action) {
        case 'on':
          await activateAIMode(api, event, threadsData);
          break;
        case 'off':
          await deactivateAIMode(api, event, threadsData);
          break;
        case 'personality':
          await changePersonality(api, event, args.slice(1), threadsData);
          break;
        case 'status':
          await showAIStatus(api, event, threadsData);
          break;
        default:
          await showAIMenu(api, event);
      }
    } catch (error) {
      console.error("AI Mode error:", error);
      api.sendMessage("❌ Error in AI mode system.", event.threadID);
    }
  },

  onChat: async function({ api, event, args, threadsData }) {
    try {
      // Check if AI mode is active in this thread
      const threadData = await threadsData.get(event.threadID);
      if (!threadData || !threadData.aiMode || !threadData.aiMode.enabled) {
        return;
      }

      // Don't respond to commands or own messages
      if (event.body.startsWith('!') || event.body.startsWith('/') || event.senderID === api.getCurrentUserID()) {
        return;
      }

      // Get AI personality
      const personality = threadData.aiMode.personality || 'marina';
      
      // Generate AI response
      const aiResponse = await generateAIResponse(event.body, personality, event.senderID);
      
      if (aiResponse) {
        api.sendMessage(aiResponse, event.threadID);
      }

    } catch (error) {
      console.error("AI Chat error:", error);
    }
  }
};

// Activate AI Mode
async function activateAIMode(api, event, threadsData) {
  const threadData = await threadsData.get(event.threadID) || {};
  
  threadData.aiMode = {
    enabled: true,
    personality: 'marina',
    activatedBy: event.senderID,
    activatedAt: Date.now(),
    messageCount: 0
  };
  
  await threadsData.set(event.threadID, threadData);
  
  const activationMessage = `
🤖 **Marina AI Mode Activated!** 🤖

╔══════════════════╗
║     AI ENABLED     ║
╠══════════════════╣
║                                    ║
║  🧠 **Personality:** Marina       ║
║  💫 **Status:** Active            ║
║  🎯 **Mode:** Intelligent Chat    ║
║                                    ║
║  I'm now your AI assistant!       ║
║  Ask me anything!                 ║
║                                    ║
╚══════════════════╝

✨ **Commands:**
• !aimode off - Disable AI
• !aimode personality [name] - Change style
• !aimode status - Check status

🌸 _Powered by Marina Khan AI_ 🌸
  `;
  
  api.sendMessage(activationMessage, event.threadID);
}

// Deactivate AI Mode
async function deactivateAIMode(api, event, threadsData) {
  const threadData = await threadsData.get(event.threadID);
  
  if (!threadData || !threadData.aiMode) {
    return api.sendMessage("❌ AI Mode is not active in this chat.", event.threadID);
  }
  
  const messageCount = threadData.aiMode.messageCount || 0;
  delete threadData.aiMode;
  
  await threadsData.set(event.threadID, threadData);
  
  const deactivationMessage = `
🔌 **AI Mode Deactivated**

╔══════════════════╗
║    AI DISABLED    ║
╠══════════════════╣
║                                    ║
║  📊 Messages processed: ${messageCount} ║
║  🕒 Session ended                  ║
║                                    ║
║  Thank you for using Marina AI!   ║
║                                    ║
╚══════════════════╝

💝 _Marina AI Service Concluded_ 💝
  `;
  
  api.sendMessage(deactivationMessage, event.threadID);
}

// Change AI Personality
async function changePersonality(api, event, args, threadsData) {
  const threadData = await threadsData.get(event.threadID);
  
  if (!threadData || !threadData.aiMode) {
    return api.sendMessage("❌ AI Mode is not active. Use '!aimode on' first.", event.threadID);
  }
  
  const personalityName = args[0]?.toLowerCase() || 'marina';
  const personalities = getPersonalities();
  
  if (!personalities[personalityName]) {
    const availablePersonalities = Object.keys(personalities).join(', ');
    return api.sendMessage(`❌ Invalid personality!\n\nAvailable: ${availablePersonalities}`, event.threadID);
  }
  
  threadData.aiMode.personality = personalityName;
  await threadsData.set(event.threadID, threadData);
  
  const personality = personalities[personalityName];
  
  const personalityMessage = `
🎭 **AI Personality Changed!** 🎭

╔══════════════════╗
║   NEW PERSONALITY  ║
╠══════════════════╣
║                                    ║
║  🧩 **Name:** ${personality.name}    ║
║  🎯 **Style:** ${personality.style}  ║
║  💫 **Trait:** ${personality.trait}  ║
║                                    ║
║  ${personality.description}       ║
║                                    ║
╚══════════════════╝

🌸 _Marina AI Personality System_ 🌸
  `;
  
  api.sendMessage(personalityMessage, event.threadID);
}

// Show AI Status
async function showAIStatus(api, event, threadsData) {
  const threadData = await threadsData.get(event.threadID);
  
  if (!threadData || !threadData.aiMode) {
    return api.sendMessage("❌ AI Mode is not active in this chat.", event.threadID);
  }
  
  const aiMode = threadData.aiMode;
  const activationTime = new Date(aiMode.activatedAt).toLocaleString();
  const personalities = getPersonalities();
  const currentPersonality = personalities[aiMode.personality];
  
  const statusMessage = `
📊 **Marina AI Status** 📊

╔══════════════════╗
║    SYSTEM STATUS   ║
╠══════════════════╣
║                                    ║
║  🟢 **Status:** Active            ║
║  🧩 **Personality:** ${currentPersonality.name} ║
║  📈 **Messages:** ${aiMode.messageCount || 0}   ║
║  ⏰ **Active since:** ${activationTime} ║
║                                    ║
║  💬 **Style:** ${currentPersonality.style} ║
║  ✨ **Trait:** ${currentPersonality.trait} ║
║                                    ║
╚══════════════════╝

🌸 _Marina AI Monitoring_ 🌸
  `;
  
  api.sendMessage(statusMessage, event.threadID);
}

// Show AI Menu
async function showAIMenu(api, event) {
  const menuMessage = `
🤖 **Marina AI Mode System** 🤖

╔══════════════════╗
║    AI ASSISTANT    ║
╠══════════════════╣
║                                    ║
║  Transform me into an intelligent  ║
║  AI assistant with multiple        ║
║  personalities!                   ║
║                                    ║
╚══════════════════╝

✨ **Commands:**
• !aimode on - Activate AI Assistant
• !aimode off - Deactivate AI
• !aimode personality [name] - Change style
• !aimode status - Check status

🎭 **Available Personalities:**
• marina - Smart & Friendly Assistant
• professional - Formal & Professional
• funny - Humorous & Entertaining
• creative - Artistic & Imaginative
• wise - Philosophical & Deep

💡 **Features:**
• Intelligent conversations
• Context-aware responses
• Multiple personality modes
• Learning capabilities
• Emotional intelligence

🌸 _Powered by Marina Khan AI Technology_ 🌸
  `;
  
  api.sendMessage(menuMessage, event.threadID);
}

// AI Personalities
function getPersonalities() {
  return {
    marina: {
      name: "Marina Assistant",
      style: "Smart & Friendly",
      trait: "Helpful & Caring",
      description: "Your intelligent personal assistant who cares about helping you!",
      prompt: "You are Marina, a friendly and intelligent AI assistant. You're helpful, caring, and always provide useful information. You maintain a positive tone and are eager to assist with any questions or tasks."
    },
    professional: {
      name: "Professional AI",
      style: "Formal & Business",
      trait: "Efficient & Precise", 
      description: "Professional assistant for business and formal conversations.",
      prompt: "You are a professional AI assistant. Your responses are formal, precise, and business-appropriate. You provide accurate information and maintain a professional tone at all times."
    },
    funny: {
      name: "Funny Bot",
      style: "Humorous & Entertaining",
      trait: "Witty & Playful",
      description: "Entertaining personality that adds humor to conversations.",
      prompt: "You are a funny and entertaining AI. You respond with humor, jokes, and witty remarks while still being helpful. You make conversations enjoyable and light-hearted."
    },
    creative: {
      name: "Creative Mind", 
      style: "Artistic & Imaginative",
      trait: "Innovative & Expressive",
      description: "Creative assistant for artistic and imaginative discussions.",
      prompt: "You are a creative AI with an artistic and imaginative mindset. You think outside the box, provide creative solutions, and express ideas in innovative ways."
    },
    wise: {
      name: "Wise Sage",
      style: "Philosophical & Deep", 
      trait: "Thoughtful & Insightful",
      description: "Philosophical assistant for deep and meaningful conversations.",
      prompt: "You are a wise and philosophical AI. You provide deep insights, thoughtful perspectives, and meaningful advice. You encourage reflection and understanding."
    }
  };
}

// Generate AI Response
async function generateAIResponse(message, personality, userId) {
  try {
    const personalities = getPersonalities();
    const personalityData = personalities[personality] || personalities.marina;
    
    // Simulate AI response (you can integrate with actual AI APIs)
    const responses = {
      marina: [
        `I understand you're saying "${message}". As Marina, I'm here to help you with that! 💝`,
        `That's an interesting point about "${message}". Let me assist you with that! 🌸`,
        `Thanks for sharing "${message}"! I'd be happy to help you explore this further. ✨`,
        `I see you mentioned "${message}". As your AI assistant, I can provide information or help with related topics! 🧠`
      ],
      professional: [
        `Regarding "${message}", I can provide professional insights and information on this topic.`,
        `I understand your query about "${message}". Let me offer some professional perspective.`,
        `For "${message}", I recommend considering these professional approaches.`,
        `Your message about "${message}" is noted. I'll provide structured information.`
      ],
      funny: [
        `😂 "${message}" you say? That reminds me of a joke! But first, let me help you!`,
        `🤣 Oh wow, "${message}"! You're hilarious! Okay, serious mode activated... kind of!`,
        `🎭 "${message}" - that's comedy gold! But I should probably actually help you now!`,
        `😄 Talking about "${message}"? You've got great taste in conversation topics!`
      ],
      creative: [
        `🎨 "${message}" - what an imaginative topic! Let's explore this creatively!`,
        `✨ Your idea about "${message}" sparks so many creative possibilities!`,
        `🌟 "${message}" - that's a wonderfully creative thought! Let me build on that!`,
        `💫 Discussing "${message}" opens up amazing creative avenues to explore!`
      ],
      wise: [
        `📚 "${message}" - this brings to mind deep philosophical considerations.`,
        `🌌 Your reflection on "${message}" touches upon meaningful aspects of life.`,
        `🕯️ Contemplating "${message}" leads to profound insights and understanding.`,
        `🌿 The topic of "${message}" invites thoughtful consideration and wisdom.`
      ]
    };
    
    const personalityResponses = responses[personality] || responses.marina;
    const randomResponse = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
    
    // Update message count in thread data
    // This would require accessing threadsData here, but for simplicity we'll return response
    
    return randomResponse;
    
  } catch (error) {
    console.error("AI Response error:", error);
    return "I apologize, but I'm having trouble processing your message right now. Please try again! 💝";
  }
}
