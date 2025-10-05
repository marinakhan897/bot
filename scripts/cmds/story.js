module.exports = {
  config: {
    name: "story",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Random mini stories",
    category: "fun",
    guide: {
      en: ".story"
    }
  },

  onStart: async function({ api, event }) {
    const stories = [
      "📖 Ek tha robot jo insaan ban gaya... Par usse pata chala insaan hone mein bahut problem hai! Usne socha 'better to be robot' 🤖",
      "📖 Ek din ek message aaya: 'You've won 1 crore!' Main bola: 'I'm a bot, mujhe paise ki kya zaroorat?' Message delete ho gaya! 💸",
      "📖 Ek chidiya ne chatbot se puchha: 'Tumhe udna aata hai?' Bot bola: 'Nahi, par main cloud storage mein rehta hoon!' ☁️",
      "📖 Do bots ki love story: 'I love you' 'I love you too' 'Syntax error' 'Syntax error'... endless loop! 💔"
    ];
    
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    api.sendMessage(randomStory, event.threadID, event.messageID);
  }
};
